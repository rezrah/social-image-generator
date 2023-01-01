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
  CircleOcticon,
  ToggleSwitch,
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
  Accordion,
  Avatar,
} from "@primer/react-brand";
import {
  CheckIcon,
  CopyIcon,
  DashIcon,
  DownloadIcon,
  ImageIcon,
  PaintbrushIcon,
  PersonAddIcon,
  PersonIcon,
  PlusIcon,
  ScreenNormalIcon,
  SyncIcon,
  TrashIcon,
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
import { ButtonField } from "../../components/form-fields/ButtonField";
import { FormFooterControls } from "../../components/form-fields/FormFooterControls";
import { Sidebar } from "../../components/Sidebar";
import { generateImage } from "../../utils/api";
import { PopoverWizard } from "../../components/PopoverWizard";
import { EventDateField } from "../../components/form-fields/EventDateField";

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
  event_date: 0,
};

// reducer function for char count
const charCountReducer = (state, action) => {
  switch (action.type) {
    case "eyebrow":
      return { ...state, eyebrow: action.payload };
    case "heading":
      return { ...state, heading: action.payload };
    case "event_date":
      return { ...state, event_date: action.payload };
    case "clear_all":
      return { ...charCountInitialStates };
    default:
      return state;
  }
};

const maxSpeakers = 4;

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
  const [speakerSwitch, setSpeakerSwitch] = React.useState(false);

  const [uri, setUri] = React.useState("");
  const [localPath, setLocalPath] = React.useState("");
  const [numSpeakers, setNumSpeakers] = React.useState<number>(0);
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

  // clear specific form field using form ref
  const handleClearField = (event, field: string) => {
    event.preventDefault();
    if (formRef && formRef.current) {
      formRef.current[field].value = "";
    }
  };

  const handleSubmit = async (event: any) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();
    setEditModeLoading(true);
    const formEl = event.target;

    const speakerData = [];

    for (let i = 0; i < numSpeakers; i++) {
      const id = i + 1;
      const speaker = {
        id,
        first_name: formEl[`speaker-card-${id}-first-name`].value,
        last_name: formEl[`speaker-card-${id}-last-name`].value,
        position: formEl[`speaker-card-${id}-position`].value,
        company: formEl[`speaker-card-${id}-company`].value,
        avatar: "https://avatars.githubusercontent.com/u/13340707?v=4",
      };
      console.log(i, speaker);
      speakerData.push(speaker);
    }

    // Get data from the form.
    const data = {
      heading: formEl.heading.value,
      subheading: formEl.subheading.value,
      event_date: formEl.event_date.value,
      theme: formEl["color-mode"].value,
      align: formEl["text-alignment"].value,
      size: sizes[0],
      speakerData,
    };

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data);

    try {
      const response = await generateImage(
        JSONdata,
        `${endpoint}/api/speaker-card`
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

  const handleSpeakerSwitch = (event) => {
    event.preventDefault();
    setSpeakerSwitch(!speakerSwitch);
  };

  const handleSwitchChange = (on: boolean) => {
    if (on && numSpeakers === 0) {
      setNumSpeakers(1);
      return;
    }

    if (!on) {
      if (numSpeakers > 0) {
        // confirm if user wants to remove all speakers
        if (window.confirm("Are you sure you want to remove all speakers?")) {
          setNumSpeakers(0);
        }
      } else {
        setNumSpeakers(0);
      }
    }
  };

  const handleAddSpeaker = (event: any) => {
    event.preventDefault();
    if (numSpeakers < maxSpeakers) {
      setNumSpeakers(numSpeakers + 1);
    }

    if (numSpeakers === maxSpeakers) {
      alert(`You can only add ${maxSpeakers} speakers`);
    }
  };

  const numSpeakersArray = Array.from(Array(numSpeakers).keys());

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
          labelOne={`Edit speaker card`}
          labelTwo="Upload CSV"
          disable={[false, true]}
        />
        <Sidebar.Inner showScrollBar>
          {activeTab === 0 && (
            <form onSubmit={handleSubmit} ref={formRef}>
              <Stack padding="none">
                <Box sx={{ padding: 4, paddingTop: 3 }}>
                  <Stack direction="vertical" gap="condensed" padding="none">
                    <EyebrowField
                      required
                      placeholder="E.g. On-Demand Session"
                      charCount={charCount.eyebrow}
                      handleCharCount={(event) =>
                        handleCharCount(
                          event as unknown as ChangeEventHandler<HTMLInputElement>,
                          "eyebrow"
                        )
                      }
                    />
                    <HeadingField
                      placeholder="E.g. The developer platform for the most ambitious enterprises"
                      required
                      charCount={charCount.heading}
                      handleCharCount={(event) =>
                        handleCharCount(
                          event as unknown as ChangeEventHandler<HTMLInputElement>,
                          "heading"
                        )
                      }
                    />
                    <EventDateField
                      required
                      placeholder="E.g. October 27, 11:30 AM PST"
                      charCount={charCount.event_date}
                      handleCharCount={(event) =>
                        handleCharCount(
                          event as unknown as ChangeEventHandler<HTMLInputElement>,
                          "event_date"
                        )
                      }
                    />
                    <Stack
                      direction="horizontal"
                      padding="none"
                      justifyContent="space-between"
                    >
                      <ThemeField
                        handleChange={(event) =>
                          setActiveTheme(event.target.value)
                        }
                      />
                      <AlignmentField />
                    </Stack>

                    <Box
                      as="hr"
                      sx={{
                        width: "100%",
                        border: 0,
                        borderTop:
                          "1px solid var(--brand-color-border-default)",
                      }}
                    />

                    <Stack
                      padding="none"
                      direction="horizontal"
                      justifyContent="space-between"
                    >
                      <Heading as="h6" id="switchLabel">
                        Add speaker{numSpeakers > 1 && "s"}
                      </Heading>
                      <ToggleSwitch
                        aria-labelledby="switchLabel"
                        size="small"
                        onClick={handleSpeakerSwitch}
                        onChange={handleSwitchChange}
                        checked={speakerSwitch}
                      />
                    </Stack>

                    <>
                      {numSpeakers >= 1 &&
                        numSpeakersArray.map((e, index) => {
                          const speakerIndex = index + 1;

                          return (
                            <Box
                              key={e}
                              id={`speaker-card-${speakerIndex}`}
                              sx={{
                                padding: 3,
                                backgroundColor:
                                  "var(--brand-color-canvas-default)",
                                border:
                                  "1px solid var(--brand-color-border-default)",
                                borderRadius: 6,
                                position: "relative",
                              }}
                            >
                              <Stack
                                direction="vertical"
                                key={e}
                                padding="none"
                              >
                                <Text as="p" size="300">
                                  Speaker {index + 1}
                                </Text>
                                <Stack
                                  direction="horizontal"
                                  gap="condensed"
                                  padding="none"
                                >
                                  <Box
                                    sx={{
                                      bg: "var(--base-color-scale-gray-2)",
                                      border:
                                        "1px solid var(--brand-color-border-default)",
                                      color:
                                        "var(--brand-color-border-default)",
                                      height: 48,
                                      width: 48,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: "50%",
                                    }}
                                  >
                                    <PersonIcon size={24} />
                                  </Box>
                                  <ProductButton sx={{ alignSelf: "center" }}>
                                    Upload image
                                  </ProductButton>
                                </Stack>
                                <Stack
                                  direction="horizontal"
                                  gap="condensed"
                                  padding="none"
                                >
                                  <FormControl
                                    required
                                    fullWidth
                                    id={`speaker-card-${speakerIndex}-first-name`}
                                  >
                                    <FormControl.Label>
                                      First name
                                    </FormControl.Label>
                                    <TextInput />
                                  </FormControl>
                                  <FormControl
                                    required
                                    fullWidth
                                    id={`speaker-card-${speakerIndex}-last-name`}
                                  >
                                    <FormControl.Label>
                                      Last name
                                    </FormControl.Label>
                                    <TextInput />
                                  </FormControl>
                                </Stack>
                                <FormControl
                                  required
                                  fullWidth
                                  id={`speaker-card-${speakerIndex}-position`}
                                >
                                  <FormControl.Label>
                                    Position
                                  </FormControl.Label>
                                  <TextInput />
                                </FormControl>
                                <FormControl
                                  fullWidth
                                  required
                                  id={`speaker-card-${speakerIndex}-company`}
                                >
                                  <FormControl.Label>Company</FormControl.Label>
                                  <Select>
                                    <Select.Option value="GitHub">
                                      GitHub
                                    </Select.Option>
                                    <Select.Option value="Google">
                                      Google
                                    </Select.Option>
                                    <Select.Option value="Microsoft">
                                      Microsoft
                                    </Select.Option>
                                  </Select>
                                </FormControl>
                              </Stack>
                            </Box>
                          );
                        })}

                      {numSpeakers >= 1 && (
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end" }}
                        >
                          <ProductButton
                            variant="danger"
                            leadingIcon={TrashIcon}
                            onClick={(event) => {
                              event.preventDefault();
                              if (window.confirm("Are you sure?")) {
                                setNumSpeakers(numSpeakers - 1);
                              }
                            }}
                            sx={{ mr: 2 }}
                          >
                            Remove
                          </ProductButton>
                          <ProductButton
                            disabled={numSpeakers === maxSpeakers}
                            variant="outline"
                            leadingIcon={PersonAddIcon}
                            onClick={handleAddSpeaker}
                          >
                            Add
                          </ProductButton>
                        </Box>
                      )}
                    </>

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
                event_date,
                theme,
                align,
                cta,
              }) => {
                const formData = {
                  filename,
                  heading,
                  subheading,
                  event_date,
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
