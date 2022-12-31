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
import useLocalStorageState from "use-local-storage-state";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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
  Popover,
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
import { Canvas } from "../../components/Canvas";
import { CsvUploader } from "../../components/CsvUploader";
import { arrayBuffer } from "stream/consumers";
import { endpoint } from "../../constants/api";
import {
  useSegmentedControls,
  SegmentedControls,
} from "../../components/SegmentedControls";
import { EyebrowField } from "../../components/form-fields/EyebrowField";
import { HeadingField } from "../../components/form-fields/HeadingField";
import { SizeField } from "../../components/form-fields/SizeField";
import { AlignmentField } from "../../components/form-fields/AlignmentField";
import { ThemeField } from "../../components/form-fields/ThemeField";
import { DescriptionField } from "../../components/form-fields/DescriptionField";
import { ButtonField } from "../../components/form-fields/ButtonField";
import { FormFooterControls } from "../../components/form-fields/FormFooterControls";
import { Sidebar } from "../../components/Sidebar";
import { generateImage } from "../../utils/api";
import { PopoverWizard } from "../../components/PopoverWizard";

type CsvData = {
  id: string;
  msg: string;
  path: string;
  uri: string;
};

const sizes = [
  { w: 1200, h: 630, typePairing: "l" },
  { w: 630, h: 630, typePairing: "m" },
  { w: 1080, h: 1080, typePairing: "xl" },
];

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
    case "clear_all":
      return { ...charCountInitialStates };
    default:
      return state;
  }
};

const CreateTemplate: NextPage = () => {
  const [showWizard, setShowWizard] = useLocalStorageState("showWizard", {
    defaultValue: true,
  });
  const router = useRouter();
  const id = router.query.id;

  const [charCount, dispatch] = React.useReducer(
    charCountReducer,
    charCountInitialStates
  );

  const [uri, setUri] = React.useState("");
  const [localPath, setLocalPath] = React.useState("");

  const [activeTheme, setActiveTheme] = React.useState("dark");

  const [activeTab, setActiveTab] = useSegmentedControls();
  const [csvConvertedData, setCsvConvertedData] = React.useState<CsvData[]>();

  const formRef = React.useRef<HTMLFormElement | null>(null);
  const fileReUploadRef = React.useRef<HTMLInputElement | null>(null);

  const [editModeLoading, setEditModeLoading] = React.useState<boolean>(false);

  const handleClear = (event) => {
    event.preventDefault();

    setUri("");
    dispatch({ type: "clear_all", payload: 0 });

    if (formRef && formRef.current) {
      formRef.current.reset();
    }
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
      const response = await generateImage(
        JSONdata,
        `${endpoint}/api/blog-header`
      );

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
    setShowWizard(false);
  };

  const handleTabChange = (activeTab: number) => {
    setActiveTab(activeTab);
    dispatch({ type: "clear_all", payload: 0 }); // Reset the character count
  };

  const handleCharCount = useCallback(
    (e: ChangeEventHandler<HTMLInputElement>, type: string) => {
      dispatch({
        type,
        payload: e.target.value.length,
      });
    },
    []
  );

  return (
    <div className={[styles["container-editor"], "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
      </Head>
      {/**Start sidebar */}
      {activeTab === 0 && (
        <PopoverWizard
          title="Create your first social image"
          action=" Got it!"
          description="Complete and submit the form to generate a new image."
          visible={showWizard}
          handlePress={() => setShowWizard(false)}
        />
      )}
      <Sidebar>
        <SegmentedControls
          activeTab={activeTab}
          handler={handleTabChange}
          labelOne={`Edit blog header`}
          labelTwo="Upload CSV"
        />
        <Sidebar.Inner>
          {activeTab === 0 && (
            <form onSubmit={handleSubmit} ref={formRef}>
              <Stack padding="none">
                <Box sx={{ padding: 4, paddingTop: 3 }}>
                  <Stack direction="vertical" gap="condensed" padding="none">
                    <EyebrowField
                      required
                      placeholder="E.g. Enterprise Security"
                      charCount={charCount.eyebrow}
                      handleCharCount={(event) =>
                        handleCharCount(
                          event as unknown as ChangeEventHandler<HTMLInputElement>,
                          "eyebrow"
                        )
                      }
                    />
                    <HeadingField
                      placeholder="E.g. Everything developers love"
                      charCount={charCount.heading}
                      handleCharCount={(event) =>
                        handleCharCount(
                          event as unknown as ChangeEventHandler<HTMLInputElement>,
                          "heading"
                        )
                      }
                    />

                    <Box
                      as="hr"
                      sx={{
                        width: "100%",
                        border: 0,
                        borderTop:
                          "1px solid var(--brand-color-border-default)",
                      }}
                    />

                    {/* {activeTheme === "custom" && (
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
                      )} */}
                    <Stack
                      direction="horizontal"
                      padding="none"
                      justifyContent="space-between"
                    >
                      <SizeField
                        supportedSizes={sizes}
                        handleChange={(event) =>
                          setActiveTheme(event.target.value)
                        }
                      />
                      <AlignmentField />
                    </Stack>
                    <ThemeField
                      handleChange={(event) =>
                        setActiveTheme(event.target.value)
                      }
                    />
                    <DescriptionField
                      placeholder="E.g. Over 56M developers worldwide depend on GitHub as the most complete, secure, compliant, and loved developer platform."
                      charCount={charCount.description}
                      handleCharCount={(event) =>
                        handleCharCount(
                          event as unknown as ChangeEventHandler<HTMLInputElement>,
                          "description"
                        )
                      }
                    />
                    <ButtonField
                      charCount={charCount.button}
                      placeholder="E.g. Contact sales"
                      handleCharCount={(event) =>
                        handleCharCount(
                          event as unknown as ChangeEventHandler<HTMLInputElement>,
                          "button"
                        )
                      }
                    />
                  </Stack>
                </Box>
                <FormFooterControls
                  isLoading={editModeLoading}
                  submitLabel={uri ? "Update" : "Create"}
                  handleClear={handleClear}
                />
              </Stack>
            </form>
          )}

          {activeTab === 1 && (
            <CsvUploader
              hasPreviouslyUploaded={Boolean(csvConvertedData)}
              uploaderRef={fileReUploadRef}
              csvDataCallback={setCsvConvertedData}
              iterator={async ({
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

                const response = await generateImage(
                  JSONdata,
                  `${endpoint}/api/blog-header`
                );

                // Get the response data from server as JSON.
                // If server returns the name submitted, that means the form works.
                const result = await response.json();

                return result;
              }}
            />
          )}
        </Sidebar.Inner>
      </Sidebar>

      <Canvas>
        {activeTab === 0 && uri && (
          <Canvas.Pannable uri={uri} localPath={localPath} />
        )}
        {activeTab === 1 && csvConvertedData && (
          <Canvas.ThumbnailGrid apiUrl={endpoint} data={csvConvertedData} />
        )}
      </Canvas>
      {/* <PageLayout.Footer>Footer</PageLayout.Footer> */}
    </div>
  );
};

export default CreateTemplate;
