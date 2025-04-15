"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State } from "wagmi";

import { PrivyClientConfig, PrivyProvider } from "@privy-io/react-auth";
import { arbitrum } from "viem/chains";
import { config } from "@/wagmi";
import { WagmiProvider } from "@privy-io/wagmi";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";

const privyConfig: PrivyClientConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: true,
    showWalletUIs: true,
  },
  loginMethods: ["wallet", "email", "google"],
  appearance: {
    showWalletLoginFirst: true,
  },
  defaultChain: arbitrum,
};

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
        config={privyConfig}
      >
        <SmartWalletsProvider
          config={{
            paymasterContext: {
              mode: "SPONSORED",
              policyId: process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID as string,
            },
          }}
        >
          <WagmiProvider config={config} initialState={props.initialState}>
            {props.children}
          </WagmiProvider>
        </SmartWalletsProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}
