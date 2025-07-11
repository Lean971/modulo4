import { ethers } from "hardhat";

import { expect } from "chai";
import { Signer } from "ethers";
import { Simpleswap, MiToken } from "../typechain-types";

describe("Simpleswap", () => {
  let owner: Signer;
  let user: Signer;
  let tokenA: MiToken;
  let tokenB: MiToken;
  let simpleswap: Simpleswap;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    // Deploy MiToken para tokenA y tokenB
    const MiTokenFactory = await ethers.getContractFactory("MiToken");
    tokenA = (await MiTokenFactory.deploy(0)) as MiToken;
    tokenB = (await MiTokenFactory.deploy(0)) as MiToken;
    await tokenA.deployed();
    await tokenB.deployed();

    // Deploy SimpleSwap
    const SimpleswapFactory = await ethers.getContractFactory("Simpleswap");
    simpleswap = (await SimpleswapFactory.deploy(tokenA.address, tokenB.address)) as Simpleswap;
    await simpleswap.deployed();

    // Minter permisos y transferencias
    await tokenA.mint(ethers.utils.parseEther("1000"));
    await tokenB.mint(ethers.utils.parseEther("1000"));

    await tokenA.approve(simpleswap.address, ethers.utils.parseEther("1000"));
    await tokenB.approve(simpleswap.address, ethers.utils.parseEther("1000"));
  });

  it("debería agregar liquidez correctamente", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 60;

    const tx = await simpleswap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("10"),
      ethers.utils.parseEther("20"),
      0,
      0,
      await owner.getAddress(),
      deadline,
    );

    await expect(tx).to.emit(simpleswap, "Transfer"); // porque el ERC20 emite Transfer al mintear liquidity tokens
  });

  it("debería devolver el precio correctamente", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 60;
    await simpleswap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("10"),
      ethers.utils.parseEther("20"),
      0,
      0,
      await owner.getAddress(),
      deadline,
    );

    const price = await simpleswap.getPrice(tokenA.address, tokenB.address);
    expect(price).to.be.gt(0);
  });

  it("debería swappear correctamente", async () => {
    const deadline = Math.floor(Date.now() / 1000) + 60;
    await simpleswap.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseEther("10"),
      ethers.utils.parseEther("10"),
      0,
      0,
      await owner.getAddress(),
      deadline,
    );

    await tokenA.approve(simpleswap.address, ethers.utils.parseEther("1"));

    const amounts = await simpleswap.callStatic.swapExactTokensForTokens(
      ethers.utils.parseEther("1"),
      0,
      [tokenA.address, tokenB.address],
      await owner.getAddress(),
      deadline,
    );

    expect(amounts[1]).to.be.gt(0);
  });
});
