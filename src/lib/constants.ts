// Uniswap V2 Testnet Addresses
export const UNISWAP_V2_ROUTER = "0x96ff7D9dbf52FdcAe79157d3b249282c7FABd409";
export const UNISWAP_V2_FACTORY = "0x566d7510dEE58360a64C9827257cF6D0Dc43985E";

// Token Information
export const ETH_TOKEN = {
  symbol: "ETH",
  name: "Ethereum",
  address: "0x9EDCde0257F2386Ce177C3a7FCdd97787F0D841d", // weth
  decimals: 18,
  logoURI: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
};

export const USDC_TOKEN = {
  symbol: "USDC",
  name: "USD Coin",
  address: "0xe4C7fBB0a626ed208021ccabA6Be1566905E2dFc",
  decimals: 6,
  logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
};

// Default tokens for swap
export const DEFAULT_FROM_TOKEN = USDC_TOKEN; // ETH
export const DEFAULT_TO_TOKEN = ETH_TOKEN; // USDC
