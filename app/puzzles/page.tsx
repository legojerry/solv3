"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@headlessui/react";
import { Connection, PublicKey } from "@solana/web3.js";

// Lazy load Wallet Button to prevent SSR issues
const WalletMultiButtonDynamic = dynamic(
  () => import("@solana/wallet-adapter-react-ui").then((mod) => mod.WalletMultiButton),
  { ssr: false }
);

interface Puzzle {
  id: number;
  cap: number;
  unlocked: boolean;
}

function Solv3Home() {
  const [marketCap, setMarketCap] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [openedPuzzle, setOpenedPuzzle] = useState<number | null>(null);
  const [walletAddress] = useState<string | null>(null);
  const [mintAddress] = useState<string | null>("8YTwudT2oTGQHK6Kv1MZcpbuFYu12iYMDbSKcpREpump");
  const [insufficientTokensDialogOpen, setInsufficientTokensDialogOpen] = useState(false);
  const { publicKey, connected } = useWallet();

  // Debugging logs for wallet and mintAddress
  useEffect(() => {
    if (!mintAddress) {
      console.error("Mint address is null or undefined.");
    }

  }, [mintAddress, publicKey]);

  // Quick log of wallet state
  useEffect(() => {
    console.log("Wallet state:", {
      connected,
      publicKey: publicKey ? publicKey.toBase58() : "No public key",
    });
  }, [connected, publicKey]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchMarketData = async () => {
        try {
          const response = await fetch(
            "https://api.dexscreener.com/tokens/v1/solana/8YTwudT2oTGQHK6Kv1MZcpbuFYu12iYMDbSKcpREpump"
          );
          const data = await response.json();
          console.log("Fetched Data:", data); // ✅ Debugging log

          if (data?.length > 0) {
            setMarketCap(data[0].marketCap || 0);
            setPrice(parseFloat(data[0].priceUsd) || 0);
            console.log("Updated Market Cap:", data[0].marketCap);
          }
        } catch (error) {
          console.error("Error fetching market data:", error);
        }
      };

      fetchMarketData();
      const interval = setInterval(fetchMarketData, 30000);
      return () => clearInterval(interval);
    }
  }, []);

  // Check for wallet holding the required token
  useEffect(() => {
    if (publicKey && mintAddress) {
      const checkTokenBalance = async () => {
        try {
		const connection = new Connection("https://solana-mainnet.rpc.extrnode.com/83cd3df0-cd2e-4384-9474-3f93fa02abf0", "confirmed");
const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
  programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // Solana SPL Token Program
});

if (tokenAccounts.value.length > 0) {
  const tokenAccount = tokenAccounts.value.find(
    (account) => account.account.data.parsed.info.mint === mintAddress
  );

  if (tokenAccount) {
    const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
    console.log("Token Balance:", balance);

    if (balance < 100000) {
      console.log("Opening dialog for insufficient tokens...");
      setInsufficientTokensDialogOpen(true);
    }
  } else {
    console.log("No token account found for this mint.");
  }
} else {
  console.log("No token accounts found for this wallet.");
}

        } catch (error) {
          console.error("Error checking token balance:", error);
        }
      };
      checkTokenBalance();
    } else {
      console.log("walletAddress or mintAddress is not defined.");
    }
  }, [publicKey, mintAddress]);

  const puzzles: Puzzle[] = [
    { id: 1, cap: 10000, unlocked: (marketCap ?? 0) >= 10000 },
    { id: 2, cap: 25000, unlocked: (marketCap ?? 0) >= 25000 },
    { id: 3, cap: 50000, unlocked: (marketCap ?? 0) >= 50000 },
    { id: 4, cap: 100000, unlocked: (marketCap ?? 0) >= 100000 },
    { id: 5, cap: 250000, unlocked: (marketCap ?? 0) >= 250000 },
    { id: 6, cap: 500000, unlocked: (marketCap ?? 0) >= 500000 },
    { id: 7, cap: 1000000, unlocked: (marketCap ?? 0) >= 1000000 },
    { id: 8, cap: 2500000, unlocked: (marketCap ?? 0) >= 2500000 },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-10 relative">
      {/* Wallet button (Lazy-loaded to prevent hydration mismatch) */}
      <div className="absolute top-4 right-4 z-50 bg-gray-900 p-2 rounded-lg shadow-lg">
        <WalletMultiButtonDynamic />
      </div>

      {/* Logo */}
      <div className="glitch-banner">
        <Image src="/solv3.png" alt="SOLV3 Logo" width={600} height={150} className="mb-6" />
      </div>

      {/* Header Text */}
      <p className="mt-4 text-gray-400 text-lg">
        Solve puzzles. Unlock rewards. Join the future of Web3 gaming.
      </p>
      <p className="mt-2 text-[#ADFF2F] font-bold">You must hold 100,000 $olv3 to play.</p>

      {/* Market Cap Progress Bar */}
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-2xl font-semibold">Puzzle Unlock Progress</h2>
        <div className="w-full bg-gray-800 h-4 mt-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ADFF2F] to-[#00FF00]"
            style={{ width: `${Math.min((marketCap ?? 0) / 1000000 * 200, 100)}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((marketCap ?? 0) / 1000000 * 200, 100)}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* Puzzle Grid */}
        <div className="w-full max-w-2xl grid grid-cols-1 gap-4 mt-10">
          {puzzles.map((puzzle) => (
            <motion.div
              key={puzzle.id}
              className={`bg-gray-900 p-6 text-center rounded-lg cursor-pointer ${
                puzzle.unlocked ? "hover:scale-105 transition-transform" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => puzzle.unlocked && setOpenedPuzzle(puzzle.id)}
            >
              <h3 className="text-xl font-bold text-[#6A0DAD]">Puzzle {puzzle.id}</h3>
              <p className="text-[#ADFF2F]">Unlocks at ${puzzle.cap} MC</p>
              <a
                href={`https://solscan.io/address/${walletAddress}`}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Wallet
              </a>
            </motion.div>
          ))}
        </div>

        {/* Puzzle Modal */}
        <Dialog
          open={openedPuzzle !== null}
          onClose={() => setOpenedPuzzle(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
        >
          <div className="bg-gray-900 p-6 rounded-lg w-1/2 text-center">
            <h2 className="text-2xl font-bold text-[#6A0DAD]">Puzzle {openedPuzzle}</h2>
            <p className="text-gray-300 mt-2">This is where the puzzle interaction will go.</p>
            <button
              onClick={() => setOpenedPuzzle(null)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </Dialog>

        {/* Insufficient Tokens Dialog */}
        <Dialog
          open={insufficientTokensDialogOpen}
          onClose={() => setInsufficientTokensDialogOpen(false)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
        >
          <div className="bg-gray-900 p-6 rounded-lg w-1/2 text-center">
            <h2 className="text-2xl font-bold text-[#6A0DAD]">Insufficient Tokens</h2>
            <p className="text-gray-300 mt-2">
              You need at least 100,000 $olv3 tokens to participate in this puzzle.
            </p>
            <button
              onClick={() => setInsufficientTokensDialogOpen(false)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </Dialog>

        {/* Market Data */}
        {marketCap !== null && (
          <p className="text-center text-[#ADFF2F] mt-2 font-bold text-lg">
            Market Cap: ${marketCap.toLocaleString()} USD
          </p>
        )}
        {price !== null && (
          <p className="text-center text-gray-400 mt-1 font-medium text-lg">
            Price: ${price.toFixed(6)} USD
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-gray-400">
        <p>Follow us:</p>
        <div className="flex space-x-4 justify-center mt-2">
          <Link href="https://x.com/solv3" target="_blank" className="hover:text-white">
            X
          </Link>
          <Link href="https://t.me/solv3" target="_blank" className="hover:text-white">
            Telegram
          </Link>
          <Link href="https://tiktok.com/@solv3" target="_blank" className="hover:text-white">
            TikTok
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Solv3Home;
