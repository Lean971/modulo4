pragma solidity >=0.8.0 <0.9.0;


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MiToken is ERC20{

constructor(uint amount) ERC20("MiToken","MTK"){
    _mint(msg.sender,amount*10**decimals());
}

function mint(uint amount) public{
    _mint (msg.sender,amount*10**decimals());

}

}