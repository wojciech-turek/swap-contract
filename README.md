# Custom Swap

Swaps native MATIC for DAI and stMATIC evenly

Follow the below guide to deploy locally

```shell
npm install
npx hardhat compile
Update information in hardhat.config.ts, replace PRIVATE_KEY with deployers key and POLYGONSCAN_API_KEY with your key to verify your contract
npx hardhat deploy --network polygon 
npx hardhat etherscan-verify --network polygon 
```

Voila! You can now go to polygon scan and do the swap.
