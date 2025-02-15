"use client";

import { useMemo, ReactNode } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import Solv3Home from "../puzzles/page"; // ✅ Import your main UI

// Explicitly define the prop types
interface WalletProviderWrapperProps {
  children: ReactNode;
}

export default function WalletProviderWrapper({ children }: WalletProviderWrapperProps) {
  const endpoint = "https://api.mainnet-beta.solana.com";
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children} {/* ✅ This should now work properly */}
          <Solv3Home />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
