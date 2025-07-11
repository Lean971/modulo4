"use client";
const amount = "1000000000000000000"; // 1 token con 18 decimales (1 * 10^18 wei)
const swapFromTokenA = true;
import { useSimpleswap } from "~~/hooks/scaffold-eth/useSimpleswap";

export const SwapPanel = () => {
  const { swap, priceAinB } = useSimpleswap(amount, swapFromTokenA);

  return (
    <div className="p-4 border rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-2">SimpleSwap Front-End</h2>

      <p className="mb-4">Precio token A en B: {priceAinB?.toString() || "Cargando..."}</p>

      <button
        onClick={() => swap.write?.()}
        disabled={!swap.write}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Swappear 1 token A por B
      </button>
    </div>
  );
};
