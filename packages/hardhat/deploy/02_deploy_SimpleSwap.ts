
// SPDX-License-Identifier: MIT
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";


 
const deploySimpleswap: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;





  await deploy("Simpleswap", {
    from: deployer,
    
    args: ["0xFa8eA68073a747748510FC7CB0ee4ba5E7bf7cA9", "0x5A47BF1ff8690EA3cd09001FB8FE5718Ef852Bb9"],
    log: true,
    
    autoMine: true,
  });


};

export default deploySimpleswap;


deploySimpleswap.tags = ["Simpleswap"];
