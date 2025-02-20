import { CallProvider } from "@/context/CallContext";
import { CallListProvider } from "@/context/CallListContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CallProvider>
      <CallListProvider>
        <ThemeProvider>
          <Component {...pageProps} />
          <Toaster
            position="bottom-left"
            reverseOrder={false}
          />
        </ThemeProvider>
      </CallListProvider>
    </CallProvider>
  );
}
