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
} from "@primer/react";

import "@primer/react-brand/lib/css/main.css";
import "@primer/react-brand/fonts/fonts.css";

import "../styles/page-transitions.css";
import { MarkGithubIcon } from "@primer/octicons-react";
import Link from "next/link";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider data-color-mode="light">
      <PRCThemeProvider colorMode="day" preventSSRMismatch>
        <BaseStyles>
          <Header>
            <Header.Item>
              <Link href="/">
                <Header.Link href="/" sx={{ fontSize: 2 }}>
                  <StyledOcticon
                    icon={MarkGithubIcon}
                    size={32}
                    sx={{ mr: 2 }}
                  />
                </Header.Link>
              </Link>
            </Header.Item>

            <Header.Item full>
              <Link href="/create">
                <Header.Link>Templates</Header.Link>
              </Link>
            </Header.Item>
            <Header.Item sx={{ mr: 0 }}>
              <Avatar
                src="https://github.com/octocat.png"
                size={20}
                square
                alt="@octocat"
              />
            </Header.Item>
          </Header>
          <TransitionEffect1>
            <Component {...pageProps} />
          </TransitionEffect1>
        </BaseStyles>
      </PRCThemeProvider>
    </ThemeProvider>
  );
}

export default MyApp;
