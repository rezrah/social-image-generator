import React, {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
} from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import csvtojson from "csvtojson";
import { CharCount } from "../../components/CharCount";

import { LeftAlign } from "../../components/icons/LeftAlign";
import { CenterAlign } from "../../components/icons/CenterAlign";

import {
  PageLayout,
  Box,
  LinkButton as ProductLinkButton,
  Button as ProductButton,
  RadioGroup,
  Radio,
  FormControl as ProductFormControl,
  IconButton,
  ButtonGroup,
  SegmentedControl,
  Flash,
  Spinner,
} from "@primer/react";

import styles from "../../styles/Home.module.css";
import {
  Text,
  Heading,
  Stack,
  Textarea,
  FormControl,
  TextInput,
  Select,
  Button,
} from "@primer/react-brand";
import {
  CheckIcon,
  CopyIcon,
  DashIcon,
  DownloadIcon,
  PaintbrushIcon,
  PlusIcon,
  ScreenNormalIcon,
  SyncIcon,
  UploadIcon,
  XIcon,
} from "@primer/octicons-react";
import { templateData } from "../../fixtures/template-data";

const sizes = [
  { w: 1200, h: 630, typePairing: "l" },
  { w: 630, h: 630, typePairing: "m" },
  { w: 1080, h: 1080, typePairing: "xl" },
];

// API endpoint where we send form data.
const endpoint =
  process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3001";

const formattedSizes = sizes.map(({ w, h }) => `${w}x${h}`);

const charCountInitialStates = {
  eyebrow: 0,
  heading: 0,
  description: 0,
  button: 0,
};

// reducer function for char count
const charCountReducer = (state, action) => {
  switch (action.type) {
    case "eyebrow":
      return { ...state, eyebrow: action.payload };
    case "heading":
      return { ...state, heading: action.payload };
    case "description":
      return { ...state, description: action.payload };
    case "button":
      return { ...state, button: action.payload };
    default:
      return state;
  }
};

const CreateTemplate: NextPage = () => {
  const router = useRouter();
  const id = router.query.id;

  const [charCount, dispatch] = React.useReducer(
    charCountReducer,
    charCountInitialStates
  );

  const [uri, setUri] = React.useState("");
  const [localPath, setLocalPath] = React.useState("");
  const [fileRawData, setFileRawData] = React.useState<
    string | ArrayBuffer | undefined
  >();
  const [activeTheme, setActiveTheme] = React.useState("dark");

  const [activeTab, setActiveTab] = React.useState(0);
  const [csvConvertedData, setCsvConvertedData] = React.useState();

  const formRef = React.useRef<HTMLFormElement | null>(null);
  const fileUploadRef = React.useRef<HTMLInputElement | null>(null);
  const fileReUploadRef = React.useRef<HTMLInputElement | null>(null);

  const [csvUploadingInProgress, setCsvUploadingInProgress] =
    React.useState<boolean>(false);

  const [editModeLoading, setEditModeLoading] = React.useState<boolean>(false);

  const [selectedRadioValue, setSelectedRadioValue] = React.useState<
    "start" | "center"
  >("start");

  /*
   * Reset file uploader
   */
  useEffect(() => {
    if (fileUploadRef && fileUploadRef.current) {
      fileUploadRef.current.value = null;
    }
    if (fileReUploadRef && fileReUploadRef.current) {
      fileReUploadRef.current.value = null;
    }
  });

  const handleOnChange = (e) => {
    e.preventDefault();

    const fileReader = new FileReader();
    const file = e.target.files[0];

    fileReader.onloadend = (e) => {
      const csvOutput = e.target.result;
      if (csvOutput) {
        setFileRawData(csvOutput);
      }
    };

    fileReader.readAsText(file);
  };

  const handleClear = (event) => {
    event.preventDefault();
    setFileRawData(undefined);
    setUri("");
    if (formRef && formRef.current) {
      formRef.current.reset();
    }
  };

  const generateImage = async (data: string) => {
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
    const response = await fetch(`${endpoint}/api`, options);
    return response;
  };

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    setEditModeLoading(true);

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

    try {
      const response = await generateImage(JSONdata);

      // Get the response data from server as JSON.
      // If server returns the name submitted, that means the form works.
      const result = await response.json();

      //alert(`Is this your full name: ${result.data}`);
      setUri(result.uri);
      setLocalPath(`${endpoint}${result.path}`);
    } catch (err) {
      setEditModeLoading(false);
    }

    setEditModeLoading(false);
  };

  const [data] = Object.keys(templateData)
    .map((key) =>
      // @ts-ignore
      templateData[key].find((template: any) => template.id === id)
    )
    .filter(Boolean);

  const handleTabChange = (activeTab: number) => {
    setActiveTab(activeTab);
  };

  useEffect(() => {
    const getData = async () => {
      if (typeof fileRawData === "string") {
        !csvUploadingInProgress && setCsvUploadingInProgress(true);
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
            setCsvUploadingInProgress(false);
          }
        } catch (error) {
          console.log(error);
          setCsvUploadingInProgress(false);
        }
      }
    };

    if (fileRawData) {
      getData();
    }
  }, [fileRawData]);

  const handleCharCount = useCallback(
    (e: ChangeEventHandler<HTMLInputElement>, type: string) => {
      dispatch({
        type,
        payload: e.target.value.length,
      });
    },
    []
  );

  const handleRadioGroupChange = useCallback(
    (newValue: string | null, e: ChangeEvent<HTMLInputElement> | undefined) => {
      setSelectedRadioValue(newValue as "start" | "center");
    },
    []
  );

  return (
    <div className={[styles["container-editor"], "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ position: "relative" }}>
        {/* <TabNav aria-label="Main" sx={{ mt: 2 }}>
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
        </TabNav> */}
      </Box>
      {/**Start sidebar */}
      <Box sx={{ overflow: "hidden", borderRadius: "6px" }}>
        <Box
          sx={{
            position: "fixed",
            left: 16,
            top: 100,
            zIndex: 2,
            backgroundColor: "var(--brand-SubdomainNavBar-canvas-default)",
            height: "calc(100vh - 120px)",
            borderRadius: "6px",
            backdropFilter: "blur(16px)",
            width: 350,
            overflow: "hidden",
            // boxShadow: "0 12px 28px rgba(140,149,159,0.3)",
          }}
        >
          <Box
            sx={{
              padding: 4,
              paddingTop: 3,
              paddingBottom: 3,
              position: "sticky",
              top: 0,
              backgroundColor: "var(--brand-color-canvas-subtle)",
              width: "calc(100%)",
              zIndex: 2,
              borderBottom: "1px solid var(--brand-color-border-default)",
            }}
          >
            <SegmentedControl
              fullWidth
              aria-label="Single image edit vs multiple selection"
              onChange={handleTabChange}
            >
              <SegmentedControl.Button
                defaultSelected
                selected={activeTab === 0}
              >
                {`Edit ${data && data.name}`}
              </SegmentedControl.Button>
              <SegmentedControl.Button selected={activeTab === 1}>
                Upload CSV
              </SegmentedControl.Button>
            </SegmentedControl>
          </Box>
          <Box
            sx={{ height: "100%", overflowY: "auto", paddingBottom: "130px" }}
          >
            {activeTab === 0 && (
              <form onSubmit={handleSubmit} ref={formRef}>
                <Stack padding="none">
                  <Box sx={{ padding: 4, paddingTop: 3 }}>
                    <Stack direction="vertical" gap="condensed" padding="none">
                      <Box
                        sx={{
                          position: "relative",
                        }}
                      >
                        <FormControl fullWidth required id="subheading">
                          <FormControl.Label>
                            Eyebrow
                            <CharCount max={50} cur={charCount.eyebrow} />
                          </FormControl.Label>
                          <TextInput
                            className={styles["custom-input-background"]}
                            type="text"
                            name="subheading"
                            required
                            placeholder="E.g. Enterprise Security"
                            maxLength={50}
                            fullWidth
                            onChange={(event) =>
                              handleCharCount(
                                event as unknown as ChangeEventHandler<HTMLInputElement>,
                                "eyebrow"
                              )
                            }
                          />
                        </FormControl>
                      </Box>

                      <Box
                        sx={{
                          position: "relative",
                        }}
                      >
                        <FormControl fullWidth required id="heading">
                          <FormControl.Label>
                            Heading
                            <CharCount max={75} cur={charCount.heading} />
                          </FormControl.Label>
                          <TextInput
                            className={styles["custom-input-background"]}
                            type="text"
                            placeholder="E.g. Everything developers love"
                            fullWidth
                            maxLength={75}
                            onChange={(event) =>
                              handleCharCount(
                                event as unknown as ChangeEventHandler<HTMLInputElement>,
                                "heading"
                              )
                            }
                          />
                        </FormControl>
                      </Box>
                      <Box
                        as="hr"
                        sx={{
                          width: "100%",
                          border: 0,
                          borderTop:
                            "1px solid var(--brand-color-border-default)",
                        }}
                      />

                      {activeTheme === "custom" && (
                        <FormControl>
                          <FormControl.Label>Colors</FormControl.Label>
                          <Stack direction="horizontal" padding="none">
                            <input
                              type="color"
                              name="custom-color-1"
                              value="#032007"
                            />
                            <input
                              type="color"
                              name="custom-color-2"
                              value="#03555C"
                            />
                          </Stack>
                        </FormControl>
                      )}
                      <Stack
                        direction="horizontal"
                        padding="none"
                        justifyContent="space-between"
                      >
                        <FormControl id="size">
                          <FormControl.Label>Size</FormControl.Label>
                          <Select
                            className={styles["custom-input-background"]}
                            fullWidth
                            defaultValue={JSON.stringify(sizes[0])}
                            onChange={(event) =>
                              setActiveTheme(event.target.value)
                            }
                          >
                            {formattedSizes.map((size, index) => (
                              <Select.Option
                                value={JSON.stringify(sizes[index])}
                                key={size}
                              >
                                {size}
                              </Select.Option>
                            ))}
                          </Select>
                        </FormControl>
                        <RadioGroup
                          name="text-alignment"
                          onChange={handleRadioGroupChange}
                        >
                          <RadioGroup.Label
                            sx={{ fontWeight: 600, fontSize: 1 }}
                          >
                            Alignment
                          </RadioGroup.Label>
                          <ButtonGroup>
                            <IconButton
                              sx={{ display: "flex", alignItems: "center" }}
                              variant={
                                selectedRadioValue === "start"
                                  ? "outline"
                                  : "default"
                              }
                              icon={LeftAlign}
                              aria-label="Align start"
                              onClick={(e: any) => {
                                e.preventDefault();
                                handleRadioGroupChange("start", e);
                              }}
                            />
                            <IconButton
                              sx={{ display: "flex", alignItems: "center" }}
                              variant={
                                selectedRadioValue === "center"
                                  ? "outline"
                                  : "default"
                              }
                              icon={CenterAlign}
                              aria-label="Align center"
                              onClick={(e: any) => {
                                e.preventDefault();
                                handleRadioGroupChange("center", e);
                              }}
                            />
                          </ButtonGroup>

                          <Box sx={{ display: "none" }}>
                            <ProductFormControl sx={{ mr: 3 }}>
                              <Radio
                                value="start"
                                name="text-alignment"
                                checked={selectedRadioValue === "start"}
                              />
                              <ProductFormControl.Label>
                                Start
                              </ProductFormControl.Label>
                            </ProductFormControl>
                            <ProductFormControl>
                              <Radio
                                value="center"
                                name="text-alignment"
                                checked={selectedRadioValue === "center"}
                              />
                              <ProductFormControl.Label>
                                Center
                              </ProductFormControl.Label>
                            </ProductFormControl>
                          </Box>
                        </RadioGroup>
                      </Stack>
                      <FormControl id="color-mode">
                        <FormControl.Label>Theme</FormControl.Label>
                        <Select
                          className={styles["custom-input-background"]}
                          fullWidth
                          defaultValue="dark"
                          onChange={(event) =>
                            setActiveTheme(event.target.value)
                          }
                        >
                          <Select.Option value="light">Light</Select.Option>
                          <Select.Option value="dark">Dark</Select.Option>
                          <Select.Option value="analog">Analog</Select.Option>
                          <Select.Option value="policy">Policy</Select.Option>
                          <Select.Option value="universe">
                            Universe
                          </Select.Option>
                          <Select.Option value="custom">Custom</Select.Option>
                        </Select>
                      </FormControl>

                      <FormControl id="description" fullWidth>
                        <Box sx={{ position: "relative" }}>
                          <FormControl.Label>
                            Description
                            <CharCount max={150} cur={charCount.description} />
                          </FormControl.Label>
                        </Box>
                        <Textarea
                          className={styles["custom-input-background"]}
                          maxLength={150}
                          rows={4}
                          fullWidth
                          placeholder="E.g. Over 56M developers worldwide depend on GitHub as the most complete, secure, compliant, and loved developer platform."
                          onChange={(event) =>
                            handleCharCount(
                              event as unknown as ChangeEventHandler<HTMLInputElement>,
                              "description"
                            )
                          }
                        />
                      </FormControl>
                      <FormControl id="button" fullWidth>
                        <Box sx={{ position: "relative" }}>
                          <FormControl.Label>
                            Button label
                            <CharCount max={25} cur={charCount.button} />
                          </FormControl.Label>
                        </Box>
                        <TextInput
                          className={styles["custom-input-background"]}
                          type="text"
                          placeholder="E.g. Contact sales"
                          maxLength={25}
                          onChange={(event) =>
                            handleCharCount(
                              event as unknown as ChangeEventHandler<HTMLInputElement>,
                              "button"
                            )
                          }
                        />
                      </FormControl>
                    </Stack>
                  </Box>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignSelf: "flex-end",
                      justifyContent: "flex-end",
                      position: "absolute",
                      bottom: "0px",
                      left: "0px",
                      right: "0px",
                      backgroundColor: "var(--brand-color-canvas-subtle)",
                      width: "calc(100%)",
                      padding: 3,
                      borderTop: "1px solid var(--brand-color-border-default)",
                    }}
                  >
                    {editModeLoading && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Spinner size="small" sx={{ mr: 2 }} />
                      </Box>
                    )}
                    <ProductButton
                      type="submit"
                      variant="default"
                      sx={{ mr: 2 }}
                      onClick={handleClear}
                    >
                      Clear
                    </ProductButton>
                    <ProductButton
                      disabled={editModeLoading}
                      type="submit"
                      variant="primary"
                    >
                      {uri ? "Update" : "Create"}
                    </ProductButton>
                  </Box>
                </Stack>
              </form>
            )}

            {activeTab === 1 && (
              <Box>
                <Flash sx={{ m: 4 }}>
                  <Stack direction="vertical" padding="none" gap="condensed">
                    <Heading as="h4" size="6">
                      Download sample .csv
                    </Heading>
                    <Text size="200">
                      Modify the content of this example .csv file and upload it
                      to generate new images.
                    </Text>
                    <div>
                      <ProductButton
                        as="a"
                        href="/fixtures/sample.csv"
                        download
                        target="_blank"
                        size="medium"
                        variant="primary"
                      >
                        Download
                      </ProductButton>
                    </div>
                  </Stack>
                </Flash>
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
                      margin: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 300,
                      backgroundImage:
                        "linear-gradient(120deg, var(--brand-color-canvas-default) 10%, var(--brand-color-canvas-subtle) 10%, var(--brand-color-canvas-subtle) 50%, var(--brand-color-canvas-default) 50%, var(--brand-color-canvas-default) 60%, var(--brand-color-canvas-subtle) 60%, var(--brand-color-canvas-subtle) 100%)",
                      backgroundSize: "6px 10.00px",
                      borderColor: "border.default",
                      borderWidth: 1,
                      borderStyle: "dotted",
                      borderRadius: 6,
                      backgroundColor: "canvas.subtle",
                      flexDirection: "column",
                    }}
                  >
                    {csvUploadingInProgress ? (
                      <Spinner />
                    ) : (
                      <>
                        <Box sx={{ display: "block", fill: "fg.subtle" }}>
                          <UploadIcon size={24} fill="inherit" />
                        </Box>
                        <Text size="300" variant="muted">
                          Upload {csvConvertedData ? "another" : "your"} .csv
                          file
                        </Text>
                      </>
                    )}
                  </Box>
                </form>
                {csvConvertedData && (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      alignSelf: "flex-end",
                      justifyContent: "flex-end",
                      position: "absolute",
                      bottom: "0px",
                      left: "0px",
                      right: "0px",
                      backgroundColor: "var(--brand-color-canvas-default)",
                      width: "calc(100%)",
                      padding: 3,
                      borderTop: "1px solid var(--brand-color-border-default)",
                    }}
                  >
                    <ProductButton sx={{ mr: 2 }}>Sync to Drive</ProductButton>
                    <ProductButton
                      variant="primary"
                      leadingIcon={DownloadIcon}
                      sx={{}}
                    >
                      Download all
                    </ProductButton>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box sx={{ zIndex: 1, position: "relative", marginTop: -1 }}>
        <Box
          sx={{
            position: "relative",
            borderWidth: 1,
            borderStyle: "solid",

            borderColor: "border.default",
            backgroundColor: "canvas.subtle",
            minHeight: "calc(100vh - 76px)",
            paddingLeft: 380,
            backgroundImage:
              "radial-gradient(#000000 13%,var(--base-color-scale-gray-7) 13%)",
            backgroundPosition: "0 0",
            backgroundSize: "20px 20px",
            // backgroundImage:
            //   "linear-gradient(45deg, var(--base-color-scale-gray-2) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--base-color-scale-gray-2) 75%), linear-gradient(45deg, transparent 75%, var(--base-color-scale-gray-2) 75%), linear-gradient(45deg, var(--base-color-scale-gray-2) 25%, transparent 25%)",
            // backgroundSize: "20px 20px",
            // backgroundPosition: "0 0, 0 0, -50px -50px, 50px 50px",
            width: "100%",
          }}
        >
          {activeTab === 0 && (
            <>
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

                        <IconButton
                          sx={{ mt: 4 }}
                          disabled={!Boolean(uri)}
                          size="large"
                          icon={CopyIcon}
                          aria-label="Copy image URL"
                          title="Copy image URL"
                        />
                        <IconButton
                          as="a"
                          disabled={!Boolean(uri)}
                          variant="primary"
                          size="large"
                          icon={DownloadIcon}
                          href={localPath}
                          download
                          target="_blank"
                          aria-label="Download image"
                          title="Download image"
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
            </>
          )}
          {activeTab === 1 && (
            <Box sx={{ padding: 4 }}>
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
                    csvConvertedData.map((line) => {
                      return (
                        <Box
                          key={line.id}
                          as="a"
                          href={endpoint + line.path}
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
                            <IconButton
                              as="a"
                              icon={DownloadIcon}
                              size="large"
                              href={endpoint + line.path}
                              download
                              target="_blank"
                            />
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
                      );
                    })}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {/* <PageLayout.Footer>Footer</PageLayout.Footer> */}
    </div>
  );
};

export default CreateTemplate;
