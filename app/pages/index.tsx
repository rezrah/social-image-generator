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
import { Button, Heading } from "@primer/react-brand";
import { CopyIcon, DownloadIcon, ImageIcon } from "@primer/octicons-react";

const Home: NextPage = () => {
  const [uri, setUri] = React.useState("");

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      title: event.target.title.value,
      category: event.target.category.value,
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Create social images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout>
        <PageLayout.Header>
          <Heading as="h3">Customise your template</Heading>
        </PageLayout.Header>
        <PageLayout.Pane>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormControl.Label>First line</FormControl.Label>
              <TextInput
                type="text"
                id="category"
                name="category"
                required
                block
              />
            </FormControl>

            <FormControl sx={{ mt: 3 }}>
              <FormControl.Label>Second line</FormControl.Label>
              <TextInput type="text" id="title" name="title" required block />
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
                Submit
              </ProductButton>
            </Box>
          </form>
        </PageLayout.Pane>
        <PageLayout.Content>
          <Box
            sx={{
              p: 3,
              borderWidth: 1,
              borderStyle: "solid",
              borderRadius: "5px",
              borderColor: "border.default",
              backgroundColor: "canvas.subtle",
              minHeight: 600,
            }}
          >
            {!uri && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 600,
                }}
              >
                <ImageIcon size={128} fill="#ddd" />
              </Box>
            )}
            {uri && (
              <img
                src={uri}
                alt="social image"
                style={{ width: "100%", height: "auto" }}
              />
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
                disabled={!uri}
                variant="default"
                sx={{ mr: 2 }}
                leadingIcon={CopyIcon}
              >
                Copy image URL
              </ProductLinkButton>
              <ProductLinkButton
                disabled={!uri}
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

export default Home;
