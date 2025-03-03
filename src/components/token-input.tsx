"use client";

import { Input } from "@/components/ui/input";
import { USDC_TOKEN, ETH_TOKEN } from "@/lib/constants";

interface TokenInputProps {
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  selectedToken: typeof ETH_TOKEN | typeof USDC_TOKEN;
  disabled?: boolean;
  balance?:
    | {
        decimals: number;
        formatted: string;
        symbol: string;
        value: bigint;
      }
    | undefined;
}

export function TokenInput({
  label,
  amount,
  onAmountChange,
  selectedToken,
  balance,
  disabled = false,
}: TokenInputProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex justify-between mb-2">
        <span className="text-lg font-medium text-muted-foreground">
          {label}
        </span>
        {balance && (
          <span className="text-sm text-muted-foreground">
            Balance: {balance.formatted}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          className="border-none text-3xl font-medium p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 md:!text-3xl"
          placeholder="0.0"
          disabled={disabled}
        />
        <div className="flex items-center gap-2 h-10 px-3 border rounded-md">
          {selectedToken.logoURI && (
            <div className="w-5 h-5 relative">
              <img
                src={selectedToken.logoURI}
                alt={selectedToken.symbol}
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <span className="font-medium">{selectedToken.symbol}</span>
        </div>
      </div>
    </div>
  );
}
