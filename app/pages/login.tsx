import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  PageLayout,
  Box,
  LinkButton as ProductLinkButton,
  Button as ProductButton,
  RadioGroup,
  CheckboxGroup,
  Label,
  Spinner,
} from "@primer/react";
import { templateData } from "../fixtures/template-data";

import styles from "../styles/Templates.module.css";
import {
  Accordion,
  AccordionContent,
  AccordionHeading,
  Button,
  Heading,
  Text,
  FormControl,
  TextInput,
  Checkbox,
  Radio,
  Stack,
} from "@primer/react-brand";
import { CopyIcon, DownloadIcon, ImageIcon } from "@primer/octicons-react";
import { useAuth } from "../auth/AuthProvider";

const Login: NextPage = () => {
  const [userName, setUserName] = useState("");
  const { user, authEnabled, signIn } = useAuth();
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authEnabled && user) {
      const timer = setTimeout(() => {
        router.push(`/create`);
      }, 2500);

      return () => {
        clearInterval(timer);
      };
    }
  }, [router, user, authEnabled]);

  useEffect(() => {
    const query = window.location.search.substring(1);
    const token = query.split("access_token=")[1];

    if (token) {
      signIn(token);
    }
  }, [token, signIn]);

  return (
    <Stack
      className={[styles.container, "page"].join(" ")}
      justifyContent="center"
      alignItems="center"
    >
      {authEnabled && user && (
        <>
          <Spinner size="large" sx={{}} />
          <Text as="p">Welcome {user.name}.</Text>
          <Text as="p" variant="muted" size="200">
            Please wait while we redirect you.
          </Text>
        </>
      )}
    </Stack>
  );
};

export default Login;
