import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
    </ThemeProvider>
  );
}
