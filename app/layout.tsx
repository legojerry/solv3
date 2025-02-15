import "./globals.css";
import WalletContextProvider from "./providers/WalletProvider"; // ✅ Import WalletContextProvider

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletContextProvider> {/* ✅ Ensure this wraps everything */}
          {children}
        </WalletContextProvider>
      </body>
    </html>
  );
}
