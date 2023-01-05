import { SubdomainNavBar } from "@primer/react-brand";
import { Component } from "react";
import { AuthHeader } from "./AuthHeader";
import TransitionEffect1 from "./TransitionEffect1";
import type { AppProps } from "next/app";
import { NextComponentType, NextPageContext } from "next/types";
import { useAuth } from "../auth/AuthProvider";

type AppRootProps = {
  component: NextComponentType<NextPageContext, any, any>;
};

export function AppRoot({ component: Component, ...pageProps }: AppRootProps) {
  const { user } = useAuth();
  return (
    <>
      <SubdomainNavBar
        title="Social assets"
        fullWidth
        titleHref={`${process.env.NEXT_PUBLIC_BASE_PATH}/`}
      >
        <SubdomainNavBar.Link
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/create`}
        >
          Templates
        </SubdomainNavBar.Link>
        {!user && (
          <SubdomainNavBar.SecondaryAction
            href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_OAUTH_APP_CLIENT_ID}`}
          >
            Sign in with GitHub
          </SubdomainNavBar.SecondaryAction>
        )}
      </SubdomainNavBar>
      <AuthHeader />
      <TransitionEffect1>
        <Component {...pageProps} />
      </TransitionEffect1>
    </>
  );
}
