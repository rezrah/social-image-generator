import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@primer/react-brand";
import TransitionEffect1 from "../components/TransitionEffect1";

import { ThemeProvider as PRCThemeProvider, BaseStyles } from "@primer/react";
import "@primer/react-brand/lib/css/main.css";
import "@primer/react-brand/fonts/fonts.css";

import "../styles/page-transitions.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <TransitionEffect1>
      <ThemeProvider data-color-mode="dark">
        <PRCThemeProvider colorMode="night">
          <BaseStyles>
            <Component {...pageProps} />
          </BaseStyles>
        </PRCThemeProvider>
      </ThemeProvider>
    </TransitionEffect1>
  );
}

export default MyApp;
