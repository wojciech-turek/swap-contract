import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy("CustomKyberSwap", {
    from: deployer,
    contract: "CustomKyberSwap",
    log: true,
    // kyberswap router on polygon
    args: ["0xC1e7dFE73E1598E3910EF4C7845B68A9Ab6F4c83"],
    skipIfAlreadyDeployed: true,
  });
};
export default func;

func.tags = ["CustomKyberSwap"];
