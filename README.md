# convexity-challenge

## Installation

To run the code, ensure that you have the following tools installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Dependencies
Install the necessary dependencies using npm:

```bash
npm install
```

## Running the code
To run the code simply execute

```bash
npm start
```

## Output
`neutron:
factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 113, [neutron]

factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, 21, [neutron]

ibc/C4A3E0BDA2A18D39FCB66C1D2945F6BF5A9714F0E5221D5E98976196B99F26E8, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 1, [neutron,stride,osmosis,stargaze,neutron]

ibc/DB12DE291358ACBF9FA7B9E710DF989AE17FD6638538BD4D70324A7C42A056CB, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 1, [neutron,osmosis,phoenix,neutron]

osmosis:
ibc/544EC5AC9035F4E23397B9B877F0F17123F1F95B90A554BEBD5C0C16962835A7, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 10, [neutron,osmosis]

ibc/BE9E1A87A5A567F6C9E9A3655C0B204F82DF11CAC0D670461BC456BA97359E8D, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 1, [neutron,stride,osmosis]

phoenix:
ibc/1716D72043436140079BDE06C8D2F76EEEA5397E661B635A9667285D2CC75F47, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, 19, [neutron,phoenix]

ibc/BD1DE0C000FC9ACF69AA38CBC766F81B54C038FF7A20ED80AABD36182FCB7FC8, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 2, [neutron,osmosis,phoenix]

stargaze:

cosmos:
ibc/3D459B55C08CE48681DB4E99101EE4BCF325A1FD02C21A85AB3BF62C9D8685BF, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 4, [neutron,stride,cosmos]

stride:
ibc/7BC3C5F0FF1AB51D0F7F818F95CB118809C8D8D5B625E81EF0CCAC931AC359BD, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, 2, [neutron,stride]

ibc/E9ED93B74C8A353A6433E9663B0781E96653B4C4718184682071CCBA08A2790D, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 5, [neutron,stride]`

### Output for traceDenom with lAsset:
`neutron:
factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, 21, [neutron]
osmosis:
phoenix:
ibc/1716D72043436140079BDE06C8D2F76EEEA5397E661B635A9667285D2CC75F47, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, 19, [neutron,phoenix]
stargaze:
cosmos:
stride:
ibc/7BC3C5F0FF1AB51D0F7F818F95CB118809C8D8D5B625E81EF0CCAC931AC359BD, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/lAsset, 2, [neutron,stride]`

### Output for traceDenom with dAsset:
`neutron:
factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 113, [neutron]
ibc/C4A3E0BDA2A18D39FCB66C1D2945F6BF5A9714F0E5221D5E98976196B99F26E8, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 1, [neutron,stride,osmosis,stargaze,neutron]
ibc/DB12DE291358ACBF9FA7B9E710DF989AE17FD6638538BD4D70324A7C42A056CB, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 1, [neutron,osmosis,phoenix,neutron]
osmosis:
ibc/544EC5AC9035F4E23397B9B877F0F17123F1F95B90A554BEBD5C0C16962835A7, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 10, [neutron,osmosis]
ibc/BE9E1A87A5A567F6C9E9A3655C0B204F82DF11CAC0D670461BC456BA97359E8D, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 1, [neutron,stride,osmosis]
phoenix:
ibc/BD1DE0C000FC9ACF69AA38CBC766F81B54C038FF7A20ED80AABD36182FCB7FC8, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 2, [neutron,osmosis,phoenix]
stargaze:
cosmos:
ibc/3D459B55C08CE48681DB4E99101EE4BCF325A1FD02C21A85AB3BF62C9D8685BF, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 4, [neutron,stride,cosmos]
stride:
ibc/E9ED93B74C8A353A6433E9663B0781E96653B4C4718184682071CCBA08A2790D, factory/neutron1lzecpea0qxw5xae92xkm3vaddeszr278k7w20c/dAsset, 5, [neutron,stride]`

### Remarks 
- Initially I wanted to only pass in one user address and derive all other chain addresses using bech32. However, Ollie's terra address appears to be different from the other addresses and could not be derived.