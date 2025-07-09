"use client";

import { useSimpleswap } from "~~/hooks/useSimpleswap";

export const SwapPanel = () => {
  const { swap, priceAinB } = useSimpleswap();

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