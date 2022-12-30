import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import {
  PageLayout,
  FormControl,
  TextInput,
  Box,
  LinkButton as ProductLinkButton,
  Button as ProductButton,
} from "@primer/react";

import styles from "../styles/Home.module.css";
import { Button, Hero, River, Heading, Text, Link } from "@primer/react-brand";
import { CopyIcon, DownloadIcon, ImageIcon } from "@primer/octicons-react";
import NextLink from "next/link";

const Home: NextPage = () => {
  return (
    <div className={[styles.container, "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box sx={{ maxWidth: 1280, margin: "0 auto" }}>
        <Hero
          className={`${styles.hero}`}
          heading=" GitHub social assets"
          description="Create personalised assets to use in your content and share with
your fans."
          primaryAction={{
            text: "Get started",
            href: "/create",
          }}
          align="center"
        />
      </Box>
    </div>
  );
};

export default Home;
