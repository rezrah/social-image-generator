import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  PageLayout,
  Box,
  LinkButton as ProductLinkButton,
  Button as ProductButton,
  RadioGroup,
  CheckboxGroup,
  Label,
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

const Login: NextPage = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const query = window.location.search.substring(1);
    const token = query.split("access_token=")[1];

    fetch("https://api.github.com/user", {
      headers: {
        // Include the token in the Authorization header
        Authorization: "token " + token,
      },
    })
      // Parse the response as JSON
      .then((res) => res.json())
      .then((res) => {
        // Once we get the response (which has many fields)
        // Documented here: https://developer.github.com/v3/users/#get-the-authenticated-user
        // Write "Welcome <user name>" to the documents body
        console.log("res", res);
        setUserName(res.login);
      });
  }, []);

  return (
    <div className={[styles.container, "page"].join(" ")}>
      Welcome {userName}!
    </div>
  );
};

export default Login;
