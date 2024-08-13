import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { QueryClientImpl } from "cosmjs-types/cosmos/bank/v1beta1/query";
import { bech32 } from 'bech32';
import {
    QueryClientImpl as TransferQuery,
    QueryDenomTraceRequest,
  } from "cosmjs-types/ibc/applications/transfer/v1/query";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

 const traceToken = async (addresses: string[]) => {
  try {
    
    for (let address of addresses){
      const prefix = address.split('1')[0];
      const chain = chainMap[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1);
      console.log(`${chain}:`);
      const tendermint = await Tendermint34Client.connect(CHAIN_RPC_ADDRESS_MAPPING[chain].rpc);
      const queryClient = new QueryClient(tendermint);
      const rpcClient = createProtobufRpcClient(queryClient);
      const bankQueryService = new QueryClientImpl(rpcClient);
      const transferQueryService = new TransferQuery(rpcClient);
      const {balances} =  await bankQueryService.AllBalances({address: CHAIN_RPC_ADDRESS_MAPPING[chain].address});
      for (let {denom, amount} of balances){
        if(denom === lAsset || denom === dAsset){
          console.log(`${denom}, ${denom}, ${amount}, [neutron]`);
          continue;
        }
        
        if (!denom.startsWith("ibc")) continue;

        let request: QueryDenomTraceRequest = {"hash": denom};
        let {denomTrace} = await transferQueryService.DenomTrace(request);
        if (denomTrace.baseDenom === lAsset || denomTrace.baseDenom === dAsset){
          let traces = [];
          const channels = denomTrace.path.split('transfer/').filter(part => part.startsWith('channel-'))
          .map(part => part.split('/')[0]);
          let next_chain = chain;
          for (let channel of channels){
            traces.push(next_chain);
            next_chain = CHAIN_CANNEL_MAPPING[next_chain][channel];
          }
          traces.push(next_chain);
          console.log(`${denom}, ${denomTrace.baseDenom}, ${amount}, [${traces}]`);
      }
    }
  }
  } catch (error) {
    console.log(error);
  }
};

// const chains = ["neutron", "osmosis", "phoenix", "stargaze", "cosmos", "stride"];

const CHAIN_RPC_ADDRESS_MAPPING = {
  "neutron": {"rpc":"https://neutron-rpc.publicnode.com:443", "address":"neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c", "chain_id":"neutron"},
  "osmosis": {"rpc":"https://osmosis-rpc.publicnode.com:443", "address":"osmo1lzecpea0qxw5xae92xkm3vaddeszr278665crd", "chain_id":"osmo"},
  "phoenix": {"rpc": "https://terra-rpc.publicnode.com:443", "address": "terra1w7mtx2g478kkhs6pgynpcjpt6aw4930q34j36v", "chain_id":"terra"},
  "stargaze": {"rpc":"https://stargaze-rpc.publicnode.com:443", "address":"stars1lzecpea0qxw5xae92xkm3vaddeszr278xas47w", "chain_id":"stars"},
  "cosmos": {"rpc":"https://cosmos-rpc.publicnode.com:443", "address":"cosmos1lzecpea0qxw5xae92xkm3vaddeszr278jp8g4l", "chain_id":"cosmos"},
  "stride": {"rpc":"https://stride-rpc.publicnode.com:443", "address":"stride1lzecpea0qxw5xae92xkm3vaddeszr2783285pn", "chain_id":"stride"},
}
const chainMap = {
  'neutron': 'neutron',
  'osmo': 'osmosis',
  'terra': 'phoenix',
  'stars': 'stargaze',
  'cosmos': 'cosmos',
  'stride': 'stride'
};
const CHAIN_CANNEL_MAPPING: Record<string, Record<string, string>> = {
	"neutron": {
    "channel-10": "osmosis",
    "channel-25": "phoenix",
    "channel-18": "stargaze",
    "channel-1": "cosmos",
    "channel-8": "stride"
  },
  "osmosis": {
    "channel-874": "neutron",
    "channel-251": "phoenix",
    "channel-75": "stargaze",
    "channel-0": "cosmos",
    "channel-326": "stride"
  },
  "phoenix": {
    "channel-229": "neutron",
    "channel-1": "osmosis",
    "channel-324": "stargaze",
    "channel-0": "cosmos",
    "channel-46": "stride"
  },
  "stargaze": {
    "channel-191": "neutron",
    "channel-0": "osmosis",
    "channel-266": "phoenix",
    "channel-239": "cosmos",
    "channel-106": "stride"
  },
  "cosmos": {
    "channel-569": "neutron",
    "channel-141": "osmosis",
    "channel-339": "phoenix",
    "channel-730": "stargaze",
    "channel-391": "stride"
  },
  "stride": {
    "channel-123": "neutron",
    "channel-5": "osmosis",
    "channel-52": "phoenix",
    "channel-19": "stargaze",
    "channel-0": "cosmos"
  }
}
const dAsset = "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset"

const lAsset = "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset"
const addresses = [
  'neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c',
  'osmo1lzecpea0qxw5xae92xkm3vaddeszr278665crd',
  'terra1w7mtx2g478kkhs6pgynpcjpt6aw4930q34j36v',
  'stars1lzecpea0qxw5xae92xkm3vaddeszr278xas47w',
  'cosmos1lzecpea0qxw5xae92xkm3vaddeszr278jp8g4l',
  'stride1lzecpea0qxw5xae92xkm3vaddeszr2783285pn'
];

traceToken(addresses);

function deriveAddress(baseAddress: string, chainId: string): string {
  // Decode the Neutron address
  const { words } = bech32.decode(baseAddress);

  // Re-encode with the Cosmos prefix
  return bech32.encode(chainId, words);
}

