"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  useAccount,
  useAccountEffect,
  useBalance,
  useDisconnect,
  useSendTransaction,
} from "wagmi";
import { useState } from "react";
import { parseEther } from "viem";
import { arbitrum } from "viem/chains";
import { useDisconnectAndLogout } from "@/hook/useDisconnectAndLogout";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

// Define types for wallet objects
interface WalletAccount {
  address: string;
  walletClientType: string;
}

function App() {
  const { login, authenticated, ready, user } = usePrivy();
  const { disconnect } = useDisconnectAndLogout();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const [txStatus, setTxStatus] = useState("");
  const { client } = useSmartWallets();

  const { sendTransactionAsync } = useSendTransaction();

  const handleSendETH = async () => {
    if (!address || !client) return;

    try {
      setTxStatus("Sending transaction...");
      const uiOptions = {
        title: "Sample title text",
        description: "Sample description text",
        buttonText: "Sample button text",
      };
      const txHash = await client.sendTransaction(
        {
          to: "0xf37380c57881EeFcf503FBbf7670895A5b6c4421",
          value: parseEther("0.00001"),
          chain: arbitrum,
        },
        { uiOptions }
      );
      setTxStatus(`Transaction sent! Hash: ${txHash}`);
    } catch (error) {
      setTxStatus(`Error: ${(error as Error).message}`);
    }
  };

  if (!ready) return <div>Loading...</div>;

  // Extract wallet information safely from user object
  const walletInfo = user?.wallet as WalletAccount | undefined;
  const linkedAccounts = user?.linkedAccounts as WalletAccount[] | undefined;

  return (
    <div
      className="container"
      style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}
    >
      <h1>Privy + Wagmi Demo</h1>

      {authenticated ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <h2>Account</h2>
            <p>Address: {address}</p>
            <p>
              Balance: {balance?.formatted} {balance?.symbol}
            </p>

            {walletInfo && <p>Wallet type: {walletInfo.walletClientType}</p>}
          </div>

          <div>
            <h2>Wallets</h2>
            {linkedAccounts?.map((account) => (
              <div key={account.address} style={{ marginBottom: "0.5rem" }}>
                <span>walletClientType: {account.address}</span>
              </div>
            ))}
          </div>

          <div>
            <h2>Actions</h2>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                onClick={handleSendETH}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#4F46E5",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Send 0.0001 ETH
              </button>

              <button
                onClick={() => disconnect()}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#EF4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Disconnect
              </button>
            </div>

            {txStatus && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "black",
                  borderRadius: "4px",
                  color: "white",
                }}
              >
                {txStatus}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <p>Please connect your wallet to continue</p>
          <button
            onClick={() => login()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#4F46E5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              marginTop: "1rem",
            }}
          >
            Connect
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
