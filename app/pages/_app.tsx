import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@primer/react-brand";

import { ThemeProvider as PRCThemeProvider, BaseStyles } from "@primer/react";
import "@primer/react-brand/lib/css/main.css";
import "@primer/react-brand/fonts/fonts.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <PRCThemeProvider>
        <BaseStyles>
          <Component {...pageProps} />
        </BaseStyles>
      </PRCThemeProvider>
    </ThemeProvider>
  );
}

export default MyApp;
