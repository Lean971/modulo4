import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";


 
const deployMitoken: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("MiToken", {
    from: deployer,
    
    args: [1000],
    log: true,
    
    autoMine: true,
  });


};

export default deployMitoken;


deployMitoken.tags = ["MiToken"];
