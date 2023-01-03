import React from "react";
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

const Create: NextPage = () => {
  return (
    <div className={[styles.container, "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH}/favicon.ico`}
        />
      </Head>

      <PageLayout containerWidth="full">
        <PageLayout.Header divider="line">
          <Stack direction="vertical" padding="none">
            <Heading as="h3">Select a template</Heading>
            <Text size="400" variant="muted">
              Choose one of the templates below to get started.
            </Text>
          </Stack>
        </PageLayout.Header>
        <PageLayout.Pane position="start" divider="line" hidden>
          <Stack>
            <FormControl>
              <FormControl.Label>Filter one</FormControl.Label>
              <Checkbox />
            </FormControl>
            <FormControl>
              <FormControl.Label>Filter two</FormControl.Label>
              <Checkbox />
            </FormControl>
            <FormControl>
              <FormControl.Label>Filter three</FormControl.Label>
              <Checkbox />
            </FormControl>
          </Stack>
        </PageLayout.Pane>
        <PageLayout.Content>
          {Object.keys(templateData)
            .reverse()
            .map((category, index) => (
              <Box sx={{ marginBottom: 3 }} key={category}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gridGap: 5,
                  }}
                >
                  {/*@ts-ignore */}
                  {templateData[category].map((template) => (
                    <Link
                      legacyBehavior
                      href={`/create/${template.id}`}
                      key={template.name}
                    >
                      <Box
                        className={styles.card}
                        as="a"
                        sx={{
                          padding: "1.5rem",
                          borderRadius: "1rem",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className={styles.thumbnail}
                          src={template.image}
                          width={200}
                          height={100}
                          alt="template"
                        />
                        <Stack
                          direction="horizontal"
                          alignItems="center"
                          padding="none"
                          gap="none"
                          justifyContent="space-between"
                        >
                          <Heading as="h6" className={styles.cardHeading}>
                            {template.name}
                          </Heading>
                          {template.isNew && (
                            <Label variant="accent">New</Label>
                          )}
                        </Stack>

                        <Text size="300" variant="muted">
                          {template.description}
                        </Text>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </Box>
            ))}
        </PageLayout.Content>

        {/* <PageLayout.Footer>Footer</PageLayout.Footer> */}
      </PageLayout>
    </div>
  );
};

export default Create;
