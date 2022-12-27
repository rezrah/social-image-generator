import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, SubdomainNavBar } from "@primer/react-brand";
import TransitionEffect1 from "../components/TransitionEffect1";

import {
  ThemeProvider as PRCThemeProvider,
  BaseStyles,
  Avatar,
  Header,
  StyledOcticon,
  SSRProvider,
} from "@primer/react";

import "@primer/react-brand/lib/css/main.css";
import "@primer/react-brand/fonts/fonts.css";
import "public/fonts/custom-fonts.css";

import "../styles/page-transitions.css";
import { MarkGithubIcon } from "@primer/octicons-react";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <ThemeProvider data-color-mode="dark">
        <PRCThemeProvider colorMode="night" preventSSRMismatch>
          <BaseStyles>
            <SubdomainNavBar title="Assets" fullWidth>
              <SubdomainNavBar.Link href="/create">
                Templates
              </SubdomainNavBar.Link>
            </SubdomainNavBar>

            <TransitionEffect1>
              <Component {...pageProps} />
            </TransitionEffect1>
          </BaseStyles>
        </PRCThemeProvider>
      </ThemeProvider>
    </SSRProvider>
  );
}

export default MyApp;
