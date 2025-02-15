"use client";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-black text-white p-10 relative">
      {/* Wallet Connect Button */}
      <div className="absolute top-4 right-4 z-50 bg-gray-900 p-2 rounded-lg shadow-lg">
        <WalletMultiButton className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700" />
      </div>

      {/* Glitch Banner Logo */}
      <div className="glitch-banner">
        <Image src="/solv3.png" alt="SOLV3 Logo" width={600} height={150} className="mb-6" />
      </div>

      {/* Landing Page Text */}
      <p className="mt-4 text-gray-400 text-lg text-center max-w-2xl">
        Solve puzzles. Unlock rewards. Join the future of Web3 gaming.
      </p>
      <p className="mt-2 text-[#ADFF2F] font-bold text-center">
        You must hold 100,000 $olv3 to play.
      </p>

      {/* Call to Action - Get Started */}
      <Link href="/puzzles">
        <motion.button
          className="mt-6 px-6 py-3 bg-[#ADFF2F] text-black font-bold text-lg rounded-lg shadow-lg hover:bg-[#00FF00] transition-all"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          Get Started
        </motion.button>
      </Link>

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
