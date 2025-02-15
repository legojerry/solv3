"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import * as WalletAdapterUI from "@solana/wallet-adapter-react-ui"; // Import everything as a namespace
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@headlessui/react";

interface Puzzle {
  id: number;
  cap: number;
  unlocked: boolean;
}

function Solv3Home() {
  const [marketCap, setMarketCap] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [openedPuzzle, setOpenedPuzzle] = useState<number | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana/YOUR_PAIR_ADDRESS");
        const data = await response.json();
        if (data && data.pairs && data.pairs.length > 0) {
          setMarketCap(data.pairs[0].fdv || 0);
          setPrice(data.pairs[0].priceUsd || 0);
        }
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    };
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  const puzzles: Puzzle[] = [
    { id: 1, cap: 10000, unlocked: marketCap >= 10000 },
    { id: 2, cap: 25000, unlocked: marketCap >= 25000 },
    { id: 3, cap: 50000, unlocked: marketCap >= 50000 },
    { id: 4, cap: 100000, unlocked: marketCap >= 100000 },
    { id: 5, cap: 250000, unlocked: marketCap >= 250000 },
    { id: 6, cap: 500000, unlocked: marketCap >= 500000 },
    { id: 7, cap: 1000000, unlocked: marketCap >= 1000000 },
    { id: 8, cap: 2500000, unlocked: marketCap >= 2500000 },
    { id: 9, cap: 5000000, unlocked: marketCap >= 5000000 },
    { id: 10, cap: 10000000, unlocked: marketCap >= 10000000 },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-10 relative">
      {/* Wallet button in the top-right */}
      <div className="absolute top-4 right-4 z-50 bg-gray-900 p-2 rounded-lg shadow-lg">
        <WalletMultiButton className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700" />
      </div>
      
<div className="glitch-banner">
  <Image src="/solv3.png" alt="SOLV3 Logo" width={600} height={150} className="mb-6" />
</div>




      
      <p className="mt-4 text-gray-400 text-lg">
        Solve puzzles. Unlock rewards. Join the future of Web3 gaming.
      </p>
      <p className="mt-2 text-[#ADFF2F] font-bold">
        You must hold 100,000 $olv3 to play.
      </p>
      
      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-2xl font-semibold">Puzzle Unlock Progress</h2>
        <div className="w-full bg-gray-800 h-4 mt-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ADFF2F] to-[#00FF00]"
            style={{ width: `${(marketCap / 10000000) * 100}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${(marketCap / 10000000) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-center text-[#ADFF2F] mt-2 font-bold text-lg">
          Market Cap: ${marketCap.toLocaleString()} USD
        </p>
      </div>

      <button
        onClick={() => setMarketCap((prev) => prev + 50000)}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
      >
        Test: Increase Market Cap
      </button>

      <div className="w-full max-w-2xl grid grid-cols-1 gap-4 mt-10">
        {puzzles.map((puzzle) => (
          <motion.div
            key={puzzle.id}
            className="bg-gray-900 p-6 text-center rounded-lg cursor-pointer"
            animate={openedPuzzle === puzzle.id ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => puzzle.unlocked && setOpenedPuzzle(puzzle.id)}
          >
            <h3 className="text-xl font-bold text-[#6A0DAD]">Puzzle {puzzle.id}</h3>
            <p className="text-[#ADFF2F]">Unlocks at ${puzzle.cap} MC</p>
          </motion.div>
        ))}
      </div>

      <Dialog
        open={openedPuzzle !== null}
        onClose={() => setOpenedPuzzle(null)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
      >
        <div className="bg-gray-900 p-6 rounded-lg w-1/2 text-center">
          <h2 className="text-2xl font-bold text-[#6A0DAD]">Puzzle {openedPuzzle}</h2>
          <p className="text-gray-300 mt-2">
            This is where the puzzle interaction will go.
          </p>
          <button
            onClick={() => setOpenedPuzzle(null)}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            Close
          </button>
        </div>
      </Dialog>

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
        <p className="mt-4">
          <Link
            href="https://pump.fun/solv3"
            target="_blank"
            className="text-[#ADFF2F] hover:text-[#00FF00] font-bold"
          >
            Buy on Pump.fun
          </Link>
        </p>
      </footer>
    </div>
  );
}

// Wrap your app with both the wallet providers and the modal provider
export default function App() {
  const endpoint = "https://api.mainnet-beta.solana.com";
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);
  // Extract WalletModalProvider from the namespace (if it exists)
  const WalletModalProvider = (WalletAdapterUI as any).WalletModalProvider;
  
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {WalletModalProvider ? (
          <WalletModalProvider>
            <Solv3Home />
          </WalletModalProvider>
        ) : (
          // Fallback if the provider isn't available (though WalletMultiButton may require it)
          <Solv3Home />
        )}
      </WalletProvider>
    </ConnectionProvider>
  );
}
