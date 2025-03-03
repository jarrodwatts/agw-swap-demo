"use client";

import { useState, useCallback } from "react";
import { useAccount, useBalance, usePublicClient } from "wagmi";
import {
  useAbstractClient,
  useLoginWithAbstract,
} from "@abstract-foundation/agw-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TokenInput } from "@/components/token-input";
import { ETH_TOKEN, USDC_TOKEN, UNISWAP_V2_ROUTER } from "@/lib/constants";
import { UniswapV2RouterABI } from "@/lib/abis/UniswapV2Router";
import { abstractTestnet } from "viem/chains";
import { Separator } from "@/components/ui/separator";
import { Address, encodeFunctionData, formatUnits, parseUnits } from "viem";
import Link from "next/link";

export function SwapForm() {
  const publicClient = usePublicClient({
    chainId: abstractTestnet.id,
  });
  const { address, isConnected, isConnecting } = useAccount();
  const { data: client } = useAbstractClient();
  const { login, logout } = useLoginWithAbstract();

  // Token states
  const [path] = useState<readonly [Address, Address]>([
    ETH_TOKEN.address as `0x${string}`,
    USDC_TOKEN.address as `0x${string}`,
  ]);

  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Get ETH and USDC balances
  const { data: ethBalance } = useBalance({
    address,
  });

  const { data: usdcBalance } = useBalance({
    address,
    token: USDC_TOKEN.address as `0x${string}`,
  });

  // Function to get quote when FROM amount changes (getAmountsOut)
  const getQuoteForFromAmount = useCallback(
    async (amount: string) => {
      if (!publicClient || !amount || parseFloat(amount) === 0) {
        setToAmount("");
        return;
      }

      setIsLoading(true);
      try {
        // Convert input amount to wei based on decimals of the FROM token (ETH = 18 decimals)
        const amountIn = parseUnits(amount, ETH_TOKEN.decimals);

        // Call getAmountsOut on Uniswap V2 Router
        const amounts = await publicClient.readContract({
          address: UNISWAP_V2_ROUTER,
          abi: UniswapV2RouterABI,
          functionName: "getAmountsOut",
          args: [amountIn, path],
        });

        // Format the output amount based on decimals of the TO token (USDC = 6 decimals)
        const formattedAmount = formatUnits(amounts[1], USDC_TOKEN.decimals);

        // Update the TO amount
        setToAmount(formattedAmount);
      } catch (error) {
        console.error("Error getting quote:", error);
        setToAmount("");
      } finally {
        setIsLoading(false);
      }
    },
    [publicClient, path]
  );

  // Handle FROM amount changes
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    getQuoteForFromAmount(value);
  };

  // Execute the swap
  const handleSwap = async () => {
    if (!client || !address || !fromAmount || !toAmount || !publicClient)
      return;

    setIsLoading(true);
    setTxHash(null);

    try {
      // Convert fromAmount to wei (ETH is in ether, need to convert to wei)
      const amountIn = parseUnits(fromAmount, ETH_TOKEN.decimals);
      const amountOutMin = parseUnits(toAmount, USDC_TOKEN.decimals);

      // Set deadline to 10 minutes from now
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 600);

      // Use the AGW client's sendTransaction method
      const hash = await client.sendTransaction({
        to: UNISWAP_V2_ROUTER,
        data: encodeFunctionData({
          abi: UniswapV2RouterABI,
          functionName: "swapExactETHForTokens",
          args: [amountOutMin, path, address, deadline],
        }),
        value: amountIn,
      });

      console.log("Swap transaction sent:", hash);
      setTxHash(hash);

      // You might want to add a toast notification here
    } catch (error) {
      console.error("Error executing swap:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <div className="p-6">
        <TokenInput
          label="From"
          amount={fromAmount}
          onAmountChange={handleFromAmountChange}
          selectedToken={ETH_TOKEN}
          balance={ethBalance}
        />

        <Separator className="my-4" />

        <TokenInput
          label="To (Estimated)"
          amount={toAmount}
          onAmountChange={() => {}} // Empty function since input is disabled
          selectedToken={USDC_TOKEN}
          balance={usdcBalance}
          disabled={true}
        />

        <div className="mt-6">
          {isConnected ? (
            <>
              <Button
                className="w-full"
                disabled={
                  !fromAmount ||
                  !toAmount ||
                  fromAmount === "0" ||
                  toAmount === "0" ||
                  isLoading
                }
                onClick={handleSwap}
              >
                {isLoading ? "Calculating..." : "Swap"}
              </Button>

              {txHash && (
                <div className="mt-4 text-center">
                  <Link
                    href={`https://sepolia.abscan.org/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 underline"
                  >
                    View transaction on Abstract Sepolia Explorer
                  </Link>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={logout}
              >
                Disconnect Wallet
              </Button>
            </>
          ) : (
            <Button className="w-full" onClick={login} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
