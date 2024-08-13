"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var stargate_1 = require("@cosmjs/stargate");
var query_1 = require("cosmjs-types/cosmos/bank/v1beta1/query");
var tendermint_rpc_1 = require("@cosmjs/tendermint-rpc");
var getBalance = function (denom, address, rcp) { return __awaiter(void 0, void 0, void 0, function () {
    var tendermint, queryClient, rpcClient, bankQueryService, balance, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, tendermint_rpc_1.Tendermint34Client.connect(rcp)];
            case 1:
                tendermint = _a.sent();
                queryClient = new stargate_1.QueryClient(tendermint);
                rpcClient = (0, stargate_1.createProtobufRpcClient)(queryClient);
                bankQueryService = new query_1.QueryClientImpl(rpcClient);
                return [4 /*yield*/, bankQueryService.Balance({
                        address: address,
                        denom: denom,
                    })];
            case 2:
                balance = (_a.sent()).balance;
                console.log("balance", balance);
                console.log("ho");
                return [2 /*return*/, balance];
            case 3:
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
getBalance("uatom", "cosmos1peydkky2dcj0n8mc9nl4rx0qwwmwph94mkp6we", "https://rpc.cosmos.network/abci_query/");
// const CHAIN_CHANNELS: Record<string, Record<string, string>> = {
//   // ... same chain channel mapping as before
// };
// const ORIGINAL_DENOMS = {
//   dAsset: "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset",
//   lAsset: "factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset",
// };
// interface TokenInfo {
//   denom: string;
//   originalDenom: string;
//   amount: number;
//   path: string[];
// }
// interface ChainTokens {
//   [chainId: string]: TokenInfo[];
// }
// async function trackTokens(address: string): Promise<ChainTokens> {
//   const results: ChainTokens = {};
//   // Track dAsset
//   const dAssetPath = await trackToken(address, ORIGINAL_DENOMS.dAsset);
//   addToResults(results, "dAsset", dAssetPath);
//   // Track lAsset
//   const lAssetPath = await trackToken(address, ORIGINAL_DENOMS.lAsset);
//   addToResults(results, "lAsset", lAssetPath);
//   return results;
// }
// async function trackToken(
//   address: string,
//   originalDenom: string
// ): Promise<TokenInfo[]> {
//   const path = ["neutron-1"];
//   let currentDenom = originalDenom;
//   let currentChain = "neutron-1";
//   let currentAmount = 100; // Example balance
//   const results: TokenInfo[] = [
//     { denom: currentDenom, originalDenom, amount: currentAmount, path },
//   ];
//   for (const chain of ["osmosis-1", "phoenix-1", "stargaze-1", "cosmoshub-4", "stride-1"]) {
//     if (CHAIN_CHANNELS[currentChain]?.[chain]) {
//       const client = await getQueryClient(chain);
//       const ibcDenom = getIbcDenom(originalDenom, CHAIN_CHANNELS[currentChain][chain]);
//       const balance = await client.getBalance(address, ibcDenom);
//       currentChain = chain;
//       currentDenom = ibcDenom;
//       currentAmount = balance.amount;
//       path.push(currentChain);
//       results.push({ denom: currentDenom, originalDenom, amount: currentAmount, path: [...path] });
//     }
//   }
//   return results;
// }
// function addToResults(results: ChainTokens, tokenType: "dAsset" | "lAsset", tokenInfo: TokenInfo[]) {
//   for (const { denom, originalDenom, amount, path } of tokenInfo) {
//     if (!results[tokenType]) {
//       results[tokenType] = [];
//     }
//     results[tokenType].push({ denom, originalDenom, amount, path });
//   }
// }
// function getIbcDenom(baseDenom: string, path: string): string {
//   const hash = createHash("sha256").update(`${path}${baseDenom}`).digest("hex");
//   return `ibc/${hash}`;
// }
// async function getQueryClient(chainId: string): Promise<QueryClient> {
//   const rpcUrl = getRpcUrl(chainId);
//   return await QueryClient.connect(rpcUrl);
// }
// function getRpcUrl(chainId: string): string {
//   // Return the appropriate RPC URL for the given chain ID
//   // (You'll need to implement this based on your infrastructure)
//   return `https://rpc.${chainId}.cosmos.network:26657`;
// }
// async function main() {
//   const address = "neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c";
//   const results = await trackTokens(address);
//   for (const [chainId, tokens] of Object.entries(results)) {
//     console.log(`${chainId}:`);
//     for (const { denom, originalDenom, amount, path } of tokens) {
//       console.log(`${denom}, ${originalDenom}, ${amount}, [${path.join(", ")}]`);
//     }
//     console.log();
//   }
//   console.log("TOTAL AMOUNTS:");
//   console.log(`${ORIGINAL_DENOMS.dAsset}, 1337`);
//   console.log(`${ORIGINAL_DENOMS.lAsset}, 1999`);
// }
// main();
