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
        <div
          className={`Primer_Brand__Hero-module__Hero___EM3jf Primer_Brand__Hero-module__Hero--align-center___HUXm3 ${styles.hero}`}
        >
          <h1 className="Primer_Brand__Heading-module__Heading___IVpmp Primer_Brand__Heading-module__Heading--1___Ufc7G Primer_Brand__Hero-module__Hero-heading___QuVBH">
            GitHub promo kits
          </h1>
          <p className="Primer_Brand__Text-module__Text___pecHN Primer_Brand__Text-module__Text--muted___lTaVa Primer_Brand__Text-module__Text--400___y7m4l Primer_Brand__Hero-module__Hero-description___vG4iA">
            Create personalised assets to use in your content and share with
            your fans.
          </p>
          <div className="Primer_Brand__Hero-module__Hero-actions___oH1NT">
            <NextLink href="/create">
              <a
                className="Primer_Brand__Button-module__Button___lDruK Primer_Brand__Button-module__Button--primary___xIC7G Primer_Brand__Button-module__Button--size-large___REN1l"
                href="#"
              >
                <span className="Primer_Brand__Text-module__Text___pecHN Primer_Brand__Text-module__Text--default___DChoE Primer_Brand__Text-module__Text--400___y7m4l Primer_Brand__Button-module__Button--label___lUBc0 Primer_Brand__Button-module__Button--label-primary___Leisi">
                  Get started
                </span>
                <svg
                  className="Primer_Brand__ExpandableArrow-module__ExpandableArrow___rkfek Primer_Brand__Button-module__Button-arrow___SkJXQ"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"
                  ></path>
                  <path
                    className="Primer_Brand__ExpandableArrow-module__ExpandableArrow-stem___g4mdy"
                    stroke="currentColor"
                    d="M1.75 8H11"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </a>
            </NextLink>
          </div>
        </div>

        {/* <div
          className={`Primer_Brand__Hero-module__Hero___EM3jf Primer_Brand__Hero-module__Hero--align-center___HUXm3 ${styles.hero}`}
        >
          <h1 className="Heading-module--Heading--5-zqV Heading-module--Heading--1--jkW+e Hero-module--Hero-heading--k9Y1T">
            GitHub promo kits
          </h1>
          <p className="Text-module--Text--RpbZh Text-module--Text--muted--wE88F Text-module--Text--400--8eAI0 Hero-module--Hero-description--EdXS1">
            Create personalised assets to use in your content and share with
            your fans.
          </p>
          <div className="Primer_Brand__Hero-module__Hero-actions___oH1NT">
            <NextLink href="/create">
              <a
                className="Primer_Brand__Button-module__Button___lDruK Primer_Brand__Button-module__Button--primary___xIC7G"
                href="/create"
              >
                <span className="Primer_Brand__Text-module__Text___pecHN Primer_Brand__Text-module__Text--default___DChoE Primer_Brand__Text-module__Text--400___y7m4l Primer_Brand__Button-module__Button--label___lUBc0 Primer_Brand__Button-module__Button--label-primary___Leisi">
                  Get started
                </span>
                <svg
                  className="Primer_Brand__ExpandableArrow-module__ExpandableArrow___rkfek Primer_Brand__Button-module__Button-arrow___SkJXQ"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    d="M7.28033 3.21967C6.98744 2.92678 6.51256 2.92678 6.21967 3.21967C5.92678 3.51256 5.92678 3.98744 6.21967 4.28033L7.28033 3.21967ZM11 8L11.5303 8.53033C11.8232 8.23744 11.8232 7.76256 11.5303 7.46967L11 8ZM6.21967 11.7197C5.92678 12.0126 5.92678 12.4874 6.21967 12.7803C6.51256 13.0732 6.98744 13.0732 7.28033 12.7803L6.21967 11.7197ZM6.21967 4.28033L10.4697 8.53033L11.5303 7.46967L7.28033 3.21967L6.21967 4.28033ZM10.4697 7.46967L6.21967 11.7197L7.28033 12.7803L11.5303 8.53033L10.4697 7.46967Z"
                  ></path>
                  <path
                    className="Primer_Brand__ExpandableArrow-module__ExpandableArrow-stem___g4mdy"
                    stroke="currentColor"
                    d="M1.75 8H11"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </a>
            </NextLink>
          </div>
        </div> */}
        {/* <River>
          <River.Visual>
            <img
              src="https://via.placeholder.com/600x400/474e57/474e57.png"
              alt="placeholder, blank area with an off-white background color"
            />
          </River.Visual>
          <River.Content>
            <Heading>Heading</Heading>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien
              sit ullamcorper id. Aliquam luctus sed turpis felis nam pulvinar
              risus elementum.
            </Text>
            <Link href="#">Call to action</Link>
          </River.Content>
        </River>
        <River align="end">
          <River.Visual>
            <img
              src="https://via.placeholder.com/600x400/474e57/474e57.png"
              alt="placeholder, blank area with an off-white background color"
            />
          </River.Visual>
          <River.Content>
            <Heading>Heading</Heading>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien
              sit ullamcorper id. Aliquam luctus sed turpis felis nam pulvinar
              risus elementum.
            </Text>
            <Link href="#">Call to action</Link>
          </River.Content>
        </River>
        <River align="center">
          <River.Visual>
            <img
              src="https://via.placeholder.com/600x400/474e57/474e57.png"
              alt="placeholder, blank area with an off-white background color"
            />
          </River.Visual>
          <River.Content>
            <Heading>Heading</Heading>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien
              sit ullamcorper id. Aliquam luctus sed turpis felis nam pulvinar
              risus elementum.
            </Text>
            <Link href="#">Call to action</Link>
          </River.Content>
        </River> */}
      </Box>
    </div>
  );
};

export default Home;
