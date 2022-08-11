import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import {
  PageLayout,
  FormControl,
  TextInput,
  Box,
  LinkButton as ProductLinkButton,
  Button as ProductButton,
  Radio,
  RadioGroup,
  Textarea,
  Select,
  IconButton,
} from "@primer/react";

import styles from "../../styles/Home.module.css";
import { Button, Heading } from "@primer/react-brand";
import {
  CopyIcon,
  DashIcon,
  DownloadIcon,
  ImageIcon,
  PlusIcon,
  ScreenNormalIcon,
  XIcon,
} from "@primer/octicons-react";
import { templateData } from "../../fixtures/template-data";

const CreateTemplate: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;

  const [uri, setUri] = React.useState("");

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    // Get data from the form.
    const data = {
      heading: event.target.heading.value,
      subheading: event.target.subheading.value,
      description: event.target.description.value,
      theme: event.target["color-mode"].value,
      align: event.target["text-alignment"].value,
      button: event.target["button"].value,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    // API endpoint where we send form data.
    const endpoint = "http://localhost:3001";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    //alert(`Is this your full name: ${result.data}`);
    setUri(result.uri);
  };

  const [data] = Object.keys(templateData)
    .map((key) => templateData[key].find((template: any) => template.id === id))
    .filter(Boolean);

  return (
    <div className={[styles.container, "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout containerWidth="full">
        <PageLayout.Header divider="line">
          <Heading as="h3">{data && data.name}</Heading>
        </PageLayout.Header>
        <PageLayout.Pane position="start" divider="line">
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ mb: 3 }}>
              <FormControl.Label>Theme</FormControl.Label>
              <Select name="color-mode" block>
                <Select.Option value="light">Light</Select.Option>
                <Select.Option value="dark" selected>
                  Dark
                </Select.Option>
                <Select.Option value="analog">Analog</Select.Option>
                <Select.Option value="policy">Policy</Select.Option>
              </Select>
            </FormControl>
            {/* <Box sx={{ mb: 3 }}>
              <RadioGroup name="choiceGroup">
                <RadioGroup.Label sx={{ fontWeight: 600, fontSize: 1 }}>
                  Theme
                </RadioGroup.Label>
                <FormControl>
                  <Radio value="light" name="color-mode" />
                  <FormControl.Label>Light</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Radio value="dark" name="color-mode" defaultChecked />
                  <FormControl.Label>Dark</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Radio value="analog" name="color-mode" />
                  <FormControl.Label>Analog</FormControl.Label>
                </FormControl>
                <FormControl>
                  <Radio value="policy" name="color-mode" />
                  <FormControl.Label>Policy</FormControl.Label>
                </FormControl>
              </RadioGroup>
            </Box> */}
            <Box sx={{ mb: 3 }}>
              <RadioGroup name="choiceGroup">
                <RadioGroup.Label sx={{ fontWeight: 600, fontSize: 1 }}>
                  Alignment
                </RadioGroup.Label>
                <Box sx={{ display: "inline-flex" }}>
                  <FormControl sx={{ mr: 3 }}>
                    <Radio value="left" name="text-alignment" />
                    <FormControl.Label>Start</FormControl.Label>
                  </FormControl>
                  <FormControl>
                    <Radio
                      value="center"
                      name="text-alignment"
                      defaultChecked
                    />
                    <FormControl.Label>Center</FormControl.Label>
                  </FormControl>
                </Box>
              </RadioGroup>
            </Box>

            <FormControl sx={{ mb: 3 }} required>
              <FormControl.Label>Heading</FormControl.Label>
              <TextInput type="text" id="heading" name="heading" block />
            </FormControl>

            <FormControl sx={{ mb: 3 }} required>
              <FormControl.Label>Sub-heading</FormControl.Label>
              <TextInput type="text" id="subheading" name="subheading" block />
            </FormControl>
            <FormControl sx={{ mb: 3 }}>
              <FormControl.Label>Description</FormControl.Label>
              <Textarea id="description" name="description" block />
            </FormControl>
            <FormControl sx={{ mb: 3 }}>
              <FormControl.Label>Call to action</FormControl.Label>
              <TextInput type="text" id="button" name="button" block />
            </FormControl>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                alignSelf: "flex-end",
                justifyContent: "flex-end",
              }}
            >
              <ProductButton type="submit" variant="default" sx={{ mr: 2 }}>
                Clear
              </ProductButton>
              <ProductButton type="submit" variant="primary">
                {uri ? "Update" : "Create"}
              </ProductButton>
            </Box>
          </form>
        </PageLayout.Pane>
        <PageLayout.Content>
          <Box
            sx={{
              position: "relative",
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: "5px",
              borderColor: "border.default",
              backgroundColor: "canvas.subtle",
              minHeight: 600,
              // backgroundImage: "radial-gradient(#21252c 13%,var(--base-color-scale-gray-2) 13%)",
              // backgroundPosition: "0 0",
              // backgroundSize: "10px 10px",
              backgroundImage:
                "linear-gradient(45deg, var(--base-color-scale-gray-2) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--base-color-scale-gray-2) 75%), linear-gradient(45deg, transparent 75%, var(--base-color-scale-gray-2) 75%), linear-gradient(45deg, var(--base-color-scale-gray-2) 25%, transparent 25%)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 0 0, -50px -50px, 50px 50px",
              width: "100%",
            }}
          >
            {/* {!uri && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 600,
                }}
              >
                <ImageIcon size={128} fill="#21252c" />
              </Box>
            )} */}

            {uri && (
              <TransformWrapper initialScale={0.9} minScale={0.2} centerOnInit>
                {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                  <React.Fragment>
                    <Box
                      sx={{
                        position: "absolute",
                        right: 3,
                        top: 3,
                        display: "grid",
                        width: "auto",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        size="large"
                        icon={PlusIcon}
                        onClick={() => zoomIn()}
                      />
                      <IconButton
                        size="large"
                        icon={DashIcon}
                        onClick={() => zoomOut()}
                      />
                      <IconButton
                        size="large"
                        icon={ScreenNormalIcon}
                        onClick={() => resetTransform()}
                      />
                    </Box>
                    <TransformComponent>
                      <img
                        src={uri}
                        alt="social image"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </TransformComponent>
                  </React.Fragment>
                )}
              </TransformWrapper>
            )}
          </Box>
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              width: "auto",
              alignSelf: "center",
            }}
          >
            <Box
              sx={{
                mt: 3,
                display: "flex",
                alignSelf: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <ProductLinkButton
                disabled={Boolean(uri)}
                variant="default"
                sx={{ mr: 2 }}
                leadingIcon={CopyIcon}
              >
                Copy image URL
              </ProductLinkButton>
              <ProductLinkButton
                disabled={Boolean(uri)}
                variant="default"
                leadingIcon={DownloadIcon}
                href="http://localhost:3001/banner/test.png"
                download
                target="_blank"
              >
                Download image
              </ProductLinkButton>
            </Box>
          </Box>
        </PageLayout.Content>

        {/* <PageLayout.Footer>Footer</PageLayout.Footer> */}
      </PageLayout>
    </div>
  );
};

export default CreateTemplate;
