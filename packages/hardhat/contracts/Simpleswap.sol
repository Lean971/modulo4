// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;




 
 import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
 import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

 
 
 
contract Simpleswap is ERC20{
 
address public tokenA;
address public tokenB;
 
constructor(address _tokenA,address _tokenB) ERC20("LiquidityToken", "LQT"){ //address token
        tokenA=_tokenA;  
        tokenB=_tokenB;
 
 
}
 
 
 
 
 
function addLiquidity(address _tokenA, address _tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity){
require(block.timestamp <= deadline, "Deadline expired");  // its a check deadline
require(_tokenA == tokenA && _tokenB == tokenB, "Invalid token pair");   //que sean los tokens correctos
 
uint balanceA = IERC20(tokenA).balanceOf(address(this)); //
uint balanceB = IERC20(tokenB).balanceOf(address(this));
 
 
 
 
 
 
 
 
IERC20(tokenA).transferFrom(msg.sender,address(this),amountADesired); //  transfer  token a user to Simpleswap
IERC20(tokenB).transferFrom(msg.sender,address(this),amountBDesired);
 
uint newBalanceA = IERC20(tokenA).balanceOf(address(this)); // y aca veo cuanto tengo despues
uint newBalanceB = IERC20(tokenB).balanceOf(address(this));
 
 
 
amountA = newBalanceA - balanceA; //y esta es la verdadera cantidad que me llego
amountB = newBalanceB - balanceB;
require(amountA >= amountAMin, "Insufficient tokenA amount");
require(amountB >= amountBMin, "Insufficient tokenB amount");
   liquidity = amountA + amountB;
    require(liquidity > 0, "Insufficient liquidity minted");
 
  _mint(to, liquidity);
 
 
 return (amountA, amountB, liquidity);
 
 
 
}
 
function removeLiquidity(address _tokenA, address _tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB){
require(block.timestamp <= deadline, "Deadline expired");  //me aseguro que no pase el deadline
require(_tokenA == tokenA && _tokenB == tokenB, "Invalid token pair");   //que sean los tokens correctos
require(liquidity > 0, "Invalid liquidity amount");
 
uint totalLiquidity = totalSupply(); // totalSupply returns the total number of existing tokens
require(totalLiquidity > 0, "No liquidity available");
 
 
 uint reserveA = IERC20(tokenA).balanceOf(address(this));
 uint reserveB = IERC20(tokenB).balanceOf(address(this));
 
        // Calcula la proporción de tokens a retirar
        amountA = (liquidity * reserveA) / totalLiquidity;
        amountB = (liquidity * reserveB) / totalLiquidity;
 
        require(amountA >= amountAMin, "Insufficient amountA");
        require(amountB >= amountBMin, "Insufficient amountB");
 
        // Quema los tokens de liquidez del usuario
        _burn(msg.sender, liquidity);
 
        // Transferencia de tokens A y B al usuario
        IERC20(tokenA).transfer(to, amountA);
        IERC20(tokenB).transfer(to, amountB);
 
 return (amountA, amountB);
}
 
 
function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts){
require(block.timestamp <= deadline, "Deadline expired");
require(path.length == 2, "Invalid path length");
 
require(
        (path[0] == tokenA && path[1] == tokenB) || 
        (path[0] == tokenB && path[1] == tokenA),
        "Invalid token pair"
    );
 
    address tokenIn = path[0];
    address tokenOut = path[1];
      // Obtener reservas actuales
    uint reserveIn = IERC20(tokenIn).balanceOf(address(this));
    uint reserveOut = IERC20(tokenOut).balanceOf(address(this));
 
    // Transferir token de entrada al contrato
    IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
 
  
 
    // Calcular amountOut usando fórmula de Uniswap v2: 
    // amountOut = (amountIn * reserveOut) / (reserveIn + amountIn)
    uint amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);
    require(amountOut >= amountOutMin, "Insufficient output amount");
 
    // Transferir token de salida al destinatario
    IERC20(tokenOut).transfer(to, amountOut);
 
 
    amounts = new uint[](2);
    amounts[0] = amountIn;
    amounts[1] = amountOut;
 
 
 
 
    return amounts;
}
 
function getPrice(address tokenA, address tokenB) external view returns (uint price){
 
 uint reserveA = IERC20(tokenA).balanceOf(address(this));
 uint reserveB = IERC20(tokenB).balanceOf(address(this));
        require(reserveA > 0, "No liquidity for tokenA");
        price = reserveB * (10 ** 18) / reserveA;
 
return price;
 
}


function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut){
        require(amountIn > 0, "Input amount must be greater than 0");
        require(reserveIn > 0 && reserveOut > 0, "Reserves must be greater than 0");
        
        amountOut = (amountIn * reserveOut) / (reserveIn + amountIn);

return amountOut;
}
 
 
 
}