import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, SubdomainNavBar } from "@primer/react-brand";
import TransitionEffect1 from "../components/TransitionEffect1";

import {
  ThemeProvider as PRCThemeProvider,
  BaseStyles,
  Avatar,
  Header,
  Box,
  StyledOcticon,
  SSRProvider,
} from "@primer/react";

import "@primer/react-brand/lib/css/main.css";
import "@primer/react-brand/fonts/fonts.css";
import "public/fonts/custom-fonts.css";

import "../styles/page-transitions.css";
import { MarkGithubIcon } from "@primer/octicons-react";
import Link from "next/link";
import { AuthProvider, useAuth } from "../auth/AuthProvider";
import { AuthHeader } from "../components/AuthHeader";
import { AppRoot } from "./AppRoot";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <ThemeProvider data-color-mode="dark">
        <PRCThemeProvider colorMode="night" preventSSRMismatch>
          <AuthProvider>
            <BaseStyles>
              <AppRoot component={Component} />
            </BaseStyles>
          </AuthProvider>
        </PRCThemeProvider>
      </ThemeProvider>
    </SSRProvider>
  );
}

export default MyApp;
