import { expect } from "chai";
const { ethers } = require("ethers"); // assuming commonjs


describe("Simpleswap", function () {
  let simpleswap: any;
  let tokenA: any;
  let tokenB: any;
  let deployer: any;
  let user: any;

  beforeEach(async () => {
    [deployer, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("ERC20Mock"); // creá un ERC20Mock para testear
    tokenA = await Token.deploy("TokenA", "TKA", deployer.address, ethers.utils.parseEther("1000"));
    tokenB = await Token.deploy("TokenB", "TKB", deployer.address, ethers.utils.parseEther("1000"));

    const Simpleswap = await ethers.getContractFactory("Simpleswap");
    simpleswap = await Simpleswap.deploy(tokenA.address, tokenB.address);
    await simpleswap.deployed();
  });

  it("debería agregar liquidez correctamente", async () => {
    await tokenA.approve(simpleswap.address, ethers.utils.parseEther("10"));
    await tokenB.approve(simpleswap.address, ethers.utils.parseEther("20"));

    const deadline = (await ethers.provider.getBlock("latest")).timestamp + 3600;
    await simpleswap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("10"),
      ethers.utils.parseEther("20"),
      0, 0, deployer.address, deadline
    );

    const balanceA = await tokenA.balanceOf(simpleswap.address);
    expect(balanceA).to.equal(ethers.utils.parseEther("10"));
  });
});