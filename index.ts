import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { QueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query";
import {
  QueryClientImpl as TransferQuery,
  QueryDenomTraceRequest,
} from "cosmjs-types/ibc/applications/transfer/v1/query";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

/// Traces the lAsset and dAsset tokens across the specified user addresses.
const traceToken = async (addresses: string[]) => {
  try {
    for (let address of addresses) {
      // get chain from address (assumes addresses have the chain separated by a '1' i.e. cosmos1pxyz...)
      const prefix = address.split("1")[0];
      const chain =
        chainMap[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1);

      // log the chain for the output
      console.log(`${chain}:`);

      // connect to the chain's rpc endpoint
      const tendermint = await Tendermint34Client.connect(
        CHAIN_RPC_MAPPING[chain].rpc
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
          continue;
        }

        // if the denom does not begin with ibc it cannot be the lAsset or dAsset
        if (!denom.startsWith("ibc")) continue;

        // for each ibc hash, trace the path it tooke
        let request: QueryDenomTraceRequest = { hash: denom };
        let { denomTrace } = await transferQueryService.DenomTrace(request);

        // if the base denom is the lAsset or dAsset, break the path down further
        if (
          denomTrace.baseDenom === lAsset ||
          denomTrace.baseDenom === dAsset
        ) {
          let path = [];

          // separate out all the channels the asset passed through
          const channels = denomTrace.path
            .split("transfer/")
            .filter((part) => part.startsWith("channel-"))
            .map((part) => part.split("/")[0]);

          // the first channel should always be the current chain, as it is where the token ended up
          let next_chain = chain;
          for (let channel of channels) {
            // we then work backwards to see which chain the token came to this chain from using the channel mapping
            path.push(next_chain);
            next_chain = CHAIN_CANNEL_MAPPING[next_chain][channel];
          }
          path.push(next_chain);
          // finally log the hash, base denom and the chains it passed through
          // we have to reverse the path list as the first listed channel is actually the last channel in the path
          console.log(
            `${denom}, ${denomTrace.baseDenom}, ${amount}, [${path.reverse()}]`
          );
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// mapping of chains to their rpc endpoints
const CHAIN_RPC_MAPPING = {
  neutron: "https://neutron-rpc.publicnode.com:443",
  osmosis: "https://osmosis-rpc.publicnode.com:443",
  phoenix: "https://terra-rpc.publicnode.com:443",
  stargaze: "https://stargaze-rpc.publicnode.com:443",
  cosmos: "https://cosmos-rpc.publicnode.com:443",
  stride: "https://stride-rpc.publicnode.com:443",
};

// mapping of chains to their address names i.e. osmosis addresses begin with osmo
const chainMap = {
  neutron: "neutron",
  osmo: "osmosis",
  terra: "phoenix",
  stars: "stargaze",
  cosmos: "cosmos",
  stride: "stride",
};

// mapping of chains to their channels
const CHAIN_CANNEL_MAPPING: Record<string, Record<string, string>> = {
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

traceToken(addresses);
