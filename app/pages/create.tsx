import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  PageLayout,
  FormControl,
  TextInput,
  Box,
  LinkButton as ProductLinkButton,
  Button as ProductButton,
  RadioGroup,
  CheckboxGroup,
  Checkbox,
  Radio,
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
} from "@primer/react-brand";
import { CopyIcon, DownloadIcon, ImageIcon } from "@primer/octicons-react";

const Create: NextPage = () => {
  return (
    <div className={[styles.container, "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout containerWidth="full">
        <PageLayout.Header divider="line">
          <Heading as="h3">Select a template</Heading>
          <Text size="400" variant="muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien
            sit ullamcorper id.
          </Text>
        </PageLayout.Header>
        <PageLayout.Pane position="start" divider="line">
          <Box display="grid" sx={{ gap: 3 }}>
            <CheckboxGroup>
              <CheckboxGroup.Label>Checkboxes</CheckboxGroup.Label>
              <FormControl>
                <Checkbox value="checkOne" />
                <FormControl.Label>Checkbox one</FormControl.Label>
              </FormControl>
              <FormControl>
                <Checkbox value="checkTwo" />
                <FormControl.Label>Checkbox two</FormControl.Label>
              </FormControl>
              <FormControl>
                <Checkbox value="checkThree" />
                <FormControl.Label>Checkbox three</FormControl.Label>
              </FormControl>
            </CheckboxGroup>

            <RadioGroup>
              <RadioGroup.Label>Radios</RadioGroup.Label>
              <FormControl>
                <Radio name="radioChoices" value="radioOne" />
                <FormControl.Label>Radio one</FormControl.Label>
              </FormControl>
              <FormControl>
                <Radio name="radioChoices" value="radioTwo" />
                <FormControl.Label>Radio two</FormControl.Label>
              </FormControl>
              <FormControl>
                <Radio name="radioChoices" value="radioThree" />
                <FormControl.Label>Radio three</FormControl.Label>
              </FormControl>
            </RadioGroup>
          </Box>
        </PageLayout.Pane>
        <PageLayout.Content>
          {Object.keys(templateData)
            .reverse()
            .map((category, index) => (
              <Box sx={{ marginBottom: 3 }} key={category}>
                <Accordion open={index === 0}>
                  <AccordionHeading> {category}</AccordionHeading>
                  <AccordionContent>
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(200px, 1fr))",
                        gridGap: 5,
                      }}
                    >
                      {templateData[category].map((template) => (
                        <Link
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
                            <img
                              className={styles.thumbnail}
                              src={template.image}
                              width={200}
                              height={100}
                            />
                            <Heading as="h6" className={styles.cardHeading}>
                              {template.name}
                            </Heading>
                            <Text size="300" variant="muted">
                              {template.description}
                            </Text>
                          </Box>
                        </Link>
                      ))}
                    </Box>
                  </AccordionContent>
                </Accordion>
              </Box>
            ))}
        </PageLayout.Content>

        {/* <PageLayout.Footer>Footer</PageLayout.Footer> */}
      </PageLayout>
    </div>
  );
};

export default Create;
