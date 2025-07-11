import { usePrepareContractWrite } from 'wagmi'



import { useAccount } from "wagmi";
import { useWriteContract, useReadContract } from 'wagmi';
import { abi } from "~~/contracts/Simpleswap.json";

const SIMPLESWAP_ADDRESS = "0x15F274D06Eb4DE3FF0DaC5Cecdfe7E0801Cc58bA";

  export const useSimpleswap = (amountIn: string, swapFromTokenA: boolean) => {
    const { address: userAddress } = useAccount();

    const tokenA = "0xFa8eA68073a747748510FC7CB0ee4ba5E7bf7cA9";
    const tokenB = "0x5A47BF1ff8690EA3cd09001FB8FE5718Ef852Bb9";

    const path = swapFromTokenA ? [tokenA, tokenB] : [tokenB, tokenA];

    const { config: swapConfig } = usePrepareContractWrite({
      address: SIMPLESWAP_ADDRESS,
      abi,
      functionName: "swapExactTokensForTokens",
      args: [
        amountIn,         // valor en wei (ejemplo: ethers.utils.parseUnits("1", 18))
        "0",              // mínimo aceptable, 0 para simplificar
        path,
        userAddress || "0x0000000000000000000000000000000000000000",
        Math.floor(Date.now() / 1000) + 60 * 20,
      ],
      enabled: Boolean(amountIn) && Boolean(userAddress),
    });

    const swap = useWriteContract(swapConfig);

    const { data: priceAinB } = useReadContract({
      address: SIMPLESWAP_ADDRESS,
      abi,
      functionName: "getPrice",
      args: [tokenA, tokenB],
      watch: true,
    });

    return { swap, priceAinB };
  };
