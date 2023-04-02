import { expect } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";

const runAssetSetup = deployments.createFixture(
  async ({ deployments, getNamedAccounts, ethers }) => {
    const contracts = await deployments.fixture(["CustomKyberSwap"]);
    const { deployer, swapper } = await getNamedAccounts();
    const SwapContract = await ethers.getContractAt(
      "CustomKyberSwap",
      contracts["CustomKyberSwap"].address
    );
    return {
      SwapContract,
      deployer,
    };
  }
);

describe("CustomKyberSwap", () => {
  it("Should deploy correctly", async () => {
    const { SwapContract } = await runAssetSetup();
    expect(SwapContract.address).to.be.properAddress;
  });

  it("should have correct DAI token address set correctly", async () => {
    const { SwapContract } = await runAssetSetup();
    const daiTokenAddress = await SwapContract.DAI();
    expect(daiTokenAddress).to.be.equal(
      "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"
    );
  });

  it("should have correct stMATIC token address set correctly", async () => {
    const { SwapContract } = await runAssetSetup();
    const stMaticTokenAddress = await SwapContract.stMATIC();
    expect(stMaticTokenAddress).to.be.equal(
      "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4"
    );
  });

  it("should have correct WMATIC token address set correctly", async () => {
    const { SwapContract } = await runAssetSetup();
    const wMaticTokenAddress = await SwapContract.WMATIC();
    expect(wMaticTokenAddress).to.be.equal(
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    );
  });
  it("should allow native currency swap for DAI and stMATIC", async () => {
    const { SwapContract } = await runAssetSetup();
    const { swapper } = await getNamedAccounts();
    // get signer
    const swapperSigner = await ethers.getSigner(swapper);
    // estimate gas
    const gasEstimate = await SwapContract.estimateGas.swapExactInputSingle({
      value: ethers.utils.parseEther("1"),
    });

    // current native currency balance of the swapper
    const nativeCurrencyBalanceBefore = await ethers.provider.getBalance(
      swapper
    );

    const tx = await SwapContract.connect(swapperSigner).swapExactInputSingle({
      value: ethers.utils.parseEther("1"),
      gasLimit: gasEstimate,
    });

    await tx.wait();

    // native balance of the swapper after the swap
    const nativeCurrencyBalanceAfter = await ethers.provider.getBalance(
      swapper
    );

    expect(nativeCurrencyBalanceAfter).to.be.lt(nativeCurrencyBalanceBefore);
    // expect native balance to be less at least 1 MATIC
    expect(nativeCurrencyBalanceAfter).to.be.lt(
      nativeCurrencyBalanceBefore.sub(ethers.utils.parseEther("1"))
    );

    // the balance of DAI should be greater than 0
    const daiTokenAddress = await SwapContract.DAI();
    const daiTokenContract = await ethers.getContractAt(
      "IERC20",
      daiTokenAddress
    );

    const daiTokenBalance = await daiTokenContract.balanceOf(swapper);
    expect(daiTokenBalance).to.be.gt(0);

    // the balance of stMATIC should be greater than 0
    const stMaticTokenAddress = await SwapContract.stMATIC();
    const stMaticTokenContract = await ethers.getContractAt(
      "IERC20",
      stMaticTokenAddress
    );

    const stMaticTokenBalance = await stMaticTokenContract.balanceOf(swapper);
    expect(stMaticTokenBalance).to.be.gt(0);
  });
});
