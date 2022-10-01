import React, { MutableRefObject, RefObject, useEffect } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import csvtojson from "csvtojson";

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
  TabNav,
} from "@primer/react";

import styles from "../../styles/Home.module.css";
import { Text, Heading } from "@primer/react-brand";
import {
  CopyIcon,
  DashIcon,
  DownloadIcon,
  PlusIcon,
  ScreenNormalIcon,
  SyncIcon,
  UploadIcon,
  XIcon,
} from "@primer/octicons-react";
import { templateData } from "../../fixtures/template-data";

const sizes = [
  { w: 1200, h: 630, typePairing: "medium" },
  { w: 630, h: 630, typePairing: "small" },
  { w: 1080, h: 1080, typePairing: "large" },
];

const formattedSizes = sizes.map(({ w, h }) => `${w}x${h}`);

const CreateTemplate: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;

  const [uri, setUri] = React.useState("");
  const [localPath, setLocalPath] = React.useState("");
  const [fileRawData, setFileRawData] = React.useState<
    string | ArrayBuffer | undefined
  >();

  const [activeTab, setActiveTab] = React.useState(1);
  const [csvConvertedData, setCsvConvertedData] = React.useState();

  const fileUploadRef = React.useRef<HTMLInputElement | null>(null);
  const fileReUploadRef = React.useRef<HTMLInputElement | null>(null);

  /*
   * Reset file uploader
   */
  useEffect(() => {
    if (fileUploadRef && fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
    if (fileReUploadRef && fileReUploadRef.current) {
      fileReUploadRef.current.value = "";
    }
  });

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();
    // @ts-ignore
    const file = e.target.files[0];

    fileReader.onload = function (event) {
      // @ts-ignore
      const csvOutput = e.target.result;
      if (csvOutput) {
        setFileRawData(csvOutput);
      }
    };

    fileReader.readAsText(file);
  };

  const generateImage = async (data: string) => {
    // API endpoint where we send form data.
    const endpoint = process.env.API_ENDPOINT || "http://localhost:3001";

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: data,
    };

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options);

    return response;
  };

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
      size: JSON.parse(event.target["size"].value),
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    const response = await generateImage(JSONdata);

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();

    //alert(`Is this your full name: ${result.data}`);
    setUri(result.uri);
    setLocalPath(result.path);
  };

  const [data] = Object.keys(templateData)
    .map((key) =>
      // @ts-ignore
      templateData[key].find((template: any) => template.id === id)
    )
    .filter(Boolean);

  const handleTabChange = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    setActiveTab(index);
  };

  useEffect(() => {
    const getData = async () => {
      if (typeof fileRawData === "string") {
        try {
          const csvdata = await csvtojson().fromString(fileRawData);

          const images = await Promise.all(
            csvdata.map(
              async ({
                filename,
                heading,
                subheading,
                description,
                theme,
                align,
                cta,
              }) => {
                const formData = {
                  filename,
                  heading,
                  subheading,
                  description,
                  theme,
                  align,
                  button: cta,
                  size: sizes[0],
                };

                // Send the data to the server in JSON format.
                const JSONdata = JSON.stringify(formData);

                const response = await generateImage(JSONdata);

                // Get the response data from server as JSON.
                // If server returns the name submitted, that means the form works.
                const result = await response.json();

                return result;
              }
            )
          );

          if (images.length) {
            // @ts-ignore
            setCsvConvertedData(images);
          }
        } catch (error) {
          console.log(error);
        }
      }
    };

    if (fileRawData) {
      getData();
    }
  }, [fileRawData]);

  return (
    <div className={[styles.container, "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageLayout containerWidth="full">
        <PageLayout.Header>
          <Heading as="h3">{data && data.name}</Heading>
          <Box sx={{ position: "relative" }}>
            <TabNav aria-label="Main" sx={{ mt: 6 }}>
              <TabNav.Link
                href="#"
                selected={activeTab === 1}
                onClick={(event) => handleTabChange(event, 1)}
                sx={{
                  fontWeight: activeTab === 1 ? 600 : "normal",
                }}
              >
                Customize {data && data.name}
              </TabNav.Link>
              <TabNav.Link
                href="#"
                onClick={(event) => handleTabChange(event, 2)}
                selected={activeTab === 2}
                sx={{
                  fontWeight: activeTab === 2 ? 600 : "normal",
                }}
              >
                Upload CSV
              </TabNav.Link>
            </TabNav>
            <Box>
              {activeTab === 1 && uri && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -1,
                    right: 0,
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "1fr 1fr",
                  }}
                >
                  <ProductLinkButton
                    disabled={!Boolean(uri)}
                    variant="default"
                    sx={{ mr: 2 }}
                    leadingIcon={CopyIcon}
                  >
                    Copy image URL
                  </ProductLinkButton>
                  <ProductLinkButton
                    variant="primary"
                    disabled={!Boolean(localPath)}
                    leadingIcon={DownloadIcon}
                    href={localPath}
                    download
                    target="_blank"
                  >
                    Download image
                  </ProductLinkButton>
                </Box>
              )}
              {activeTab === 2 && csvConvertedData && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -1,
                    right: 0,
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "1fr 1fr 0.5fr",
                  }}
                >
                  <form>
                    <Box
                      ref={fileUploadRef}
                      as="input"
                      type={"file"}
                      id={"reuploadNewCsv"}
                      accept={".csv"}
                      onChange={handleOnChange}
                      sx={{ display: "none" }}
                    />
                    {/* @ts-ignore */}
                    <ProductLinkButton
                      as="label"
                      leadingIcon={UploadIcon}
                      htmlFor="reuploadNewCsv"
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      Upload .csv file
                    </ProductLinkButton>
                  </form>
                  <ProductButton leadingIcon={SyncIcon}>
                    Sync to Google Drive
                  </ProductButton>
                  <ProductButton variant="primary" leadingIcon={DownloadIcon}>
                    Download all
                  </ProductButton>
                </Box>
              )}
            </Box>
          </Box>
        </PageLayout.Header>
        {activeTab === 1 && (
          <PageLayout.Pane position="start" divider="line">
            <form onSubmit={handleSubmit}>
              <FormControl sx={{ mb: 3 }}>
                <FormControl.Label>Theme</FormControl.Label>
                <Select name="color-mode" block defaultValue="dark">
                  <Select.Option value="light">Light</Select.Option>
                  <Select.Option value="dark">Dark</Select.Option>
                  <Select.Option value="analog">Analog</Select.Option>
                  <Select.Option value="policy">Policy</Select.Option>
                  <Select.Option value="universe">Universe</Select.Option>
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

              <Box sx={{ mb: 3 }}>
                <RadioGroup name="choiceGroup">
                  <RadioGroup.Label sx={{ fontWeight: 600, fontSize: 1 }}>
                    Size
                  </RadioGroup.Label>
                  <Box sx={{ display: "inline-flex" }}>
                    {formattedSizes.map((size, index) => (
                      <FormControl sx={{ mr: 3 }} key={size}>
                        <Radio
                          value={JSON.stringify(sizes[index])}
                          name="size"
                          defaultChecked={index === 0}
                        />
                        <FormControl.Label>{size}</FormControl.Label>
                      </FormControl>
                    ))}
                  </Box>
                </RadioGroup>
              </Box>

              <FormControl sx={{ mb: 3 }} required id="heading">
                <FormControl.Label>Heading</FormControl.Label>
                <TextInput type="text" name="heading" block />
              </FormControl>

              <FormControl sx={{ mb: 3 }} required>
                <FormControl.Label>Sub-heading</FormControl.Label>
                <TextInput
                  type="text"
                  id="subheading"
                  name="subheading"
                  block
                />
              </FormControl>
              <FormControl sx={{ mb: 3 }} id="description">
                <FormControl.Label>Description</FormControl.Label>
                <Textarea name="description" block />
              </FormControl>
              <FormControl sx={{ mb: 3 }} id="button">
                <FormControl.Label>Call to action</FormControl.Label>
                <TextInput type="text" name="button" block />
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
        )}
        <PageLayout.Content>
          {activeTab === 1 && (
            <>
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
                  <TransformWrapper
                    initialScale={0.8}
                    minScale={0.2}
                    centerOnInit
                  >
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
            </>
          )}

          {activeTab === 2 && (
            <Box>
              {!csvConvertedData && (
                <form>
                  <Box
                    ref={fileReUploadRef}
                    as="input"
                    type={"file"}
                    id={"csvFileInput"}
                    accept={".csv"}
                    onChange={handleOnChange}
                    sx={{ display: "none" }}
                  />
                  <Box
                    as="label"
                    htmlFor="csvFileInput"
                    sx={{
                      cursor: "pointer",
                      margin: "8vh auto",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 300,
                      width: 500,
                      borderColor: "border.default",
                      borderWidth: 1,
                      borderStyle: "dotted",
                      borderRadius: 6,
                      backgroundColor: "canvas.subtle",
                      flexDirection: "column",
                    }}
                  >
                    <Box sx={{ display: "block", fill: "fg.subtle" }}>
                      <UploadIcon size={24} fill="inherit" />
                    </Box>
                    <Text size="300" variant="muted">
                      Upload your .csv file
                    </Text>
                  </Box>
                  {/* <ProductButton
                    variant="default"
                    type="submit"
                    onClick={(e) => {
                      handleOnSubmit(e);
                    }}
                  >
                    Import CSV
                  </ProductButton> */}
                </form>
              )}
              {csvConvertedData && (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(400px, 1fr))",
                    gridGap: 5,
                  }}
                >
                  {csvConvertedData.length > 0 &&
                    csvConvertedData.map((line) => (
                      <Box
                        key={line.id}
                        as="a"
                        href={line.path}
                        download
                        target="_blank"
                        sx={{ position: "relative" }}
                      >
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
                          <IconButton icon={DownloadIcon} size="large" />
                        </Box>
                        <Box
                          as="img"
                          key={line.id}
                          src={line.uri}
                          alt="social image"
                          sx={{
                            width: "100%",
                            height: "auto",
                            border: "1px solid",
                            borderColor: "border.subtle",
                            borderRadius: 6,
                          }}
                        />
                      </Box>
                    ))}
                </Box>
              )}
            </Box>
          )}
        </PageLayout.Content>

        {/* <PageLayout.Footer>Footer</PageLayout.Footer> */}
      </PageLayout>
    </div>
  );
};

export default CreateTemplate;
