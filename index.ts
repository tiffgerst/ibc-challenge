import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { QueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query";
import {
  QueryClientImpl as TransferQuery,
  QueryDenomTraceRequest,
} from "cosmjs-types/ibc/applications/transfer/v1/query";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

// mapping of chains to their rpc endpoints
const CHAIN_RPC_MAPPING: Record<string, string> = {
  neutron: "https://neutron-rpc.publicnode.com:443",
  osmosis: "https://osmosis-rpc.publicnode.com:443",
  phoenix: "https://terra-rpc.publicnode.com:443",
  stargaze: "https://stargaze-rpc.publicnode.com:443",
  cosmos: "https://cosmos-rpc.publicnode.com:443",
  stride: "https://stride-rpc.publicnode.com:443",
};

// mapping of chains to their bech32 prefix
const CHAIN_PREFIX_MAPPING: Record<string, string> = {
  neutron: "neutron",
  osmo: "osmosis",
  terra: "phoenix",
  stars: "stargaze",
  cosmos: "cosmos",
  stride: "stride",
};

// mapping of chains to their channels
const CHAIN_CHANNEL_MAPPING: Record<string, Record<string, string>> = {
  neutron: {
    "channel-10": "osmosis",
    "channel-25": "phoenix",
    "channel-18": "stargaze",
    "channel-1": "cosmos",
    "channel-8": "stride",
  },
  osmosis: {
    "channel-874": "neutron",
    "channel-251": "phoenix",
    "channel-75": "stargaze",
    "channel-0": "cosmos",
    "channel-326": "stride",
  },
  phoenix: {
    "channel-229": "neutron",
    "channel-1": "osmosis",
    "channel-324": "stargaze",
    "channel-0": "cosmos",
    "channel-46": "stride",
  },
  stargaze: {
    "channel-191": "neutron",
    "channel-0": "osmosis",
    "channel-266": "phoenix",
    "channel-239": "cosmos",
    "channel-106": "stride",
  },
  cosmos: {
    "channel-569": "neutron",
    "channel-141": "osmosis",
    "channel-339": "phoenix",
    "channel-730": "stargaze",
    "channel-391": "stride",
  },
  stride: {
    "channel-123": "neutron",
    "channel-5": "osmosis",
    "channel-52": "phoenix",
    "channel-19": "stargaze",
    "channel-0": "cosmos",
  },
};

// original dAsset and lAsset
const dAsset = "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset";
const lAsset = "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset";

// Ollie's addresses of interest
const addresses = [
  "neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c",
  "osmo1lzecpea0qxw5xae92xkm3vaddeszr278665crd",
  "terra1w7mtx2g478kkhs6pgynpcjpt6aw4930q34j36v",
  "stars1lzecpea0qxw5xae92xkm3vaddeszr278xas47w",
  "cosmos1lzecpea0qxw5xae92xkm3vaddeszr278jp8g4l",
  "stride1lzecpea0qxw5xae92xkm3vaddeszr2783285pn",
];

// Helper functions

/// Get chain from address prefix
const getChainFromAddress = (address: string) => {
  const prefix = address.split("1")[0];
  return (
    CHAIN_PREFIX_MAPPING[prefix] ||
    prefix.charAt(0).toUpperCase() + prefix.slice(1)
  );
};

/// Traces the path of the denom across chains
const tracePath = (chain: string, denomTrace: { path: string }) => {
  // separate out all the channels the asset passed through
  const channels = denomTrace.path
    .split("transfer/")
    .filter((part) => part.startsWith("channel-"))
    .map((part) => part.split("/")[0]);

  // the first channel should always be the current chain, as it is where the token ended up
  const path = [chain];

  let nextChain = chain;
  // we then work backwards to see which chain the token came to this chain from using the channel mapping
  for (const channel of channels) {
    nextChain = CHAIN_CHANNEL_MAPPING[nextChain][channel];
    path.push(nextChain);
  }
  // we have to reverse the path list as the first listed channel is actually the last channel in the path
  return path.reverse();
};

/// Traces the lAsset and dAsset tokens across the specified user addresses.
const traceDenoms = async (addresses: string[]) => {
  let lAssetAmount = 0;
  let dAssetAmount = 0;
  try {
    for (let address of addresses) {
      const chain = getChainFromAddress(address);

      // log the chain for the output
      console.log(`${chain.charAt(0).toUpperCase() + chain.slice(1)}:`);

      // connect to the chain's rpc endpoint
      const tendermint = await Tendermint34Client.connect(
        CHAIN_RPC_MAPPING[chain]
      );
      const queryClient = new QueryClient(tendermint);
      const rpcClient = createProtobufRpcClient(queryClient);

      // create banking and transfer query clients to fetch user balances and denom traces
      const bankQueryService = new QueryClientImpl(rpcClient);
      const transferQueryService = new TransferQuery(rpcClient);

      // first fetch all user balances for the given address and chain
      const { balances } = await bankQueryService.AllBalances({ address });
      for (let { denom, amount } of balances) {
        // if the denom is the lAsset or dAsset, log and continue as this must be the original denom chain
        if (denom === lAsset || denom === dAsset) {
          console.log(`${denom}, ${denom}, ${amount}, [${chain}]`);
          denom === lAsset
            ? (lAssetAmount += parseInt(amount))
            : (dAssetAmount += parseInt(amount));
          continue;
        }

        // if the denom does not begin with ibc it cannot be the lAsset or dAsset
        if (!denom.startsWith("ibc")) continue;

        // for each ibc hash, trace the path it took
        let request: QueryDenomTraceRequest = { hash: denom };
        let { denomTrace } = await transferQueryService.DenomTrace(request);

        // if the base denom is the lAsset or dAsset, break the path down further
        if (
          denomTrace.baseDenom === lAsset ||
          denomTrace.baseDenom === dAsset
        ) {
          let path = tracePath(chain, denomTrace);

          // finally log the hash, base denom and the chains it passed through
          console.log(
            `${denom}, ${denomTrace.baseDenom}, ${amount}, [${path}]`
          );
          denomTrace.baseDenom === lAsset
            ? (lAssetAmount += parseInt(amount))
            : (dAssetAmount += parseInt(amount));
        }
      }
    }
    console.log(`\nTOTAL AMOUNTS:`);
    console.log(`${lAsset}, ${lAssetAmount}`);
    console.log(`${dAsset}, ${dAssetAmount}`);
  } catch (error) {
    console.log(error);
  }
};

/// Alternative function to trace a specific asset across the specified user addresses.
const traceDenom = async (addresses: string[], asset: string) => {
  try {
    let totalAmount = 0;
    for (let address of addresses) {
      const chain = getChainFromAddress(address);

      // log the chain for the output
      console.log(`${chain.charAt(0).toUpperCase() + chain.slice(1)}:`);

      // connect to the chain's rpc endpoint
      const tendermint = await Tendermint34Client.connect(
        CHAIN_RPC_MAPPING[chain]
      );
      const queryClient = new QueryClient(tendermint);
      const rpcClient = createProtobufRpcClient(queryClient);

      // create banking and transfer query clients to fetch user balances and denom traces
      const bankQueryService = new QueryClientImpl(rpcClient);
      const transferQueryService = new TransferQuery(rpcClient);

      // first fetch all user balances for the given address and chain
      const { balances } = await bankQueryService.AllBalances({ address });
      for (let { denom, amount } of balances) {
        // if the denom is the asset, log and continue as this must be the original denom chain
        if (denom === asset) {
          console.log(`${denom}, ${denom}, ${amount}, [${chain}]`);
          totalAmount += parseInt(amount);
          continue;
        }

        // if the denom does not begin with ibc it cannot be the asset
        if (!denom.startsWith("ibc")) continue;

        // for each ibc hash, trace the path it took
        let request: QueryDenomTraceRequest = { hash: denom };
        let { denomTrace } = await transferQueryService.DenomTrace(request);

        // if the base denom is the asset, break the path down further
        if (denomTrace.baseDenom === asset) {
          totalAmount += parseInt(amount);
          let path = tracePath(chain, denomTrace);

          // finally log the hash, base denom and the chains it passed through
          console.log(
            `${denom}, ${denomTrace.baseDenom}, ${amount}, [${path}]`
          );
        }
      }
    }
    console.log(`\nTOTAL AMOUNTS:\n${asset}, ${totalAmount}`);
  } catch (error) {
    console.log(error);
  }
};

// uncomment as desired
traceDenoms(addresses);
// traceDenom(addresses, lAsset);
// traceDenom(addresses, dAsset);
