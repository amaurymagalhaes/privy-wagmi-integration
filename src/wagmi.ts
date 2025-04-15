import { http, cookieStorage, createStorage } from "wagmi";
import { arbitrum } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { createConfig } from "@privy-io/wagmi";

export const config = createConfig({
  chains: [arbitrum],
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string,
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  transports: {
    [arbitrum.id]: http(),
  },
});
