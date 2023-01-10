import React, {
  ChangeEvent,
  ChangeEventHandler,
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
} from "react";
import localFont from "@next/font/local";

import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import csvtojson from "csvtojson";

import {
  PageLayout,
  Box,
  LinkButton as ProductLinkButton,
  Button as ProductButton,
  Radio,
  RadioGroup,
  Textarea,
  IconButton,
  TabNav,
  Flash,
  StyledOcticon,
} from "@primer/react";

import styles from "../../styles/Home.module.css";
import {
  Text,
  Heading,
  Stack,
  FormControl,
  TextInput,
  Select,
} from "@primer/react-brand";
import "@primer/react-brand/fonts/fonts.css";
import {
  AlertIcon,
  CopyIcon,
  DashIcon,
  DownloadIcon,
  PlusIcon,
  ScreenNormalIcon,
  ShareIcon,
  SyncIcon,
  UploadIcon,
  XIcon,
} from "@primer/octicons-react";
import { templateData } from "../../fixtures/template-data";

import {
  typePairings,
  fgDefault,
  fgMuted,
} from "../../../api/shared/constants.js";
import { wrapText } from "../../../api/shared/utils.js";
import { Canvas } from "../../components/Canvas";
import { AlignmentField } from "../../components/form-fields/AlignmentField";
import { ButtonField } from "../../components/form-fields/ButtonField";
import { DescriptionField } from "../../components/form-fields/DescriptionField";
import { EyebrowField } from "../../components/form-fields/EyebrowField";
import { FormFooterControls } from "../../components/form-fields/FormFooterControls";
import { HeadingField } from "../../components/form-fields/HeadingField";
import { SizeField } from "../../components/form-fields/SizeField";
import { PopoverWizard } from "../../components/PopoverWizard";
import { Sidebar } from "../../components/Sidebar";
import useLocalStorageState from "use-local-storage-state";
import { CharCount } from "../../components/CharCount";
import { useAuthenticatedPage } from "../../auth/AuthProvider";

const sizes = [
  { w: 1200, h: 630, typePairing: "l" },
  { w: 630, h: 630, typePairing: "m" },
  { w: 1080, h: 1080, typePairing: "xl" },
];

const formattedSizes = sizes.map(({ w, h }) => `${w}x${h}`);

const charCountInitialStates = {
  eyebrow: 0,
  heading: 0,
  description: 0,
  button: 0,
};

const themes = [
  {
    name: "Octoverse",
    path: `${process.env.NEXT_PUBLIC_BASE_PATH}/octoverse.webm`,
    bgMode: "light",
  },
  {
    name: "Forrester",
    path: `${process.env.NEXT_PUBLIC_BASE_PATH}/forrester.mp4`,
    bgMode: "dark",
  },
  {
    name: "Gradient animation",
    path: `${process.env.NEXT_PUBLIC_BASE_PATH}/gradient-animation-1.webm`,
    bgMode: "dark",
  },
  {
    name: "Gradient animation 2",
    path: `${process.env.NEXT_PUBLIC_BASE_PATH}/gradient-animation-2.webm`,
    bgMode: "dark",
  },
  {
    name: "Universe",
    path: `${process.env.NEXT_PUBLIC_BASE_PATH}/animated-1.mov`,
    bgMode: "dark",
  },
];

const defaultTheme = themes[3];

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

// eslint-disable-next-line react/display-name
const Video = React.memo(({ videoRef, src, ...props }) => {
  return (
    <video
      ref={videoRef}
      src={src}
      preload="auto"
      autoPlay
      playsInline
      muted
      hidden
      {...props}
    ></video>
  );
});

const CreateTemplate: NextPage = () => {
  const canvasRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const [heading, setHeading] = React.useState("");
  const [subheading, setSubheading] = React.useState("");
  const [size, setSize] = React.useState(sizes[0]);
  const [align, setAlign] = React.useState("left");
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [theme, setTheme] = React.useState(defaultTheme.path);
  const [showWizard, setShowWizard] = useLocalStorageState("showWizard", {
    defaultValue: true,
  });

  const [charCount, dispatch] = React.useReducer(
    charCountReducer,
    charCountInitialStates
  );

  useAuthenticatedPage();

  useEffect(() => {
    const isMounted = true;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (video) {
      video.loop = true;
    }
    const ctx = canvas.getContext("2d");

    /* merge with api version*/
    const renderText = (canvas) => {
      const ctx = canvas.getContext("2d");
      const positionCanvasCenter = canvas.width / 2;
      const startPosition = align === "center" ? positionCanvasCenter : 64;
      const activeTheme =
        themes.find((t) => t.path === theme) || defaultTheme.bgMode;

      // add mark

      const getMarkFilePath = () => {
        switch (activeTheme.bgMode) {
          case "light":
            return `${process.env.NEXT_PUBLIC_BASE_PATH}/mark-github-24-dark.png`;
          case "dark":
            return `${process.env.NEXT_PUBLIC_BASE_PATH}/mark-github-24.png`;
          case "copilot":
            return `${process.env.NEXT_PUBLIC_BASE_PATH}/copilot-mark.png`;
          default:
            return `${process.env.NEXT_PUBLIC_BASE_PATH}/mark-github-24.png`;
        }
      };

      const img = new Image();
      img.src = getMarkFilePath();
      console.log(getMarkFilePath());

      const markStartingPosY = size.typePairing === "xl" ? 520 : 420;
      const dimension = size.typePairing === "xl" ? 150 : 72;

      ctx.drawImage(
        img,
        align === "center" ? startPosition - dimension / 2 : startPosition,
        //markStartingPosY - wrappedText[1] - 250, // hug to text
        startPosition,
        theme === "copilot" ? 352 : dimension,
        theme === "copilot" ? 43 : dimension
      );

      ctx.font = typePairings[size.typePairing].heading;
      ctx.fillStyle = fgDefault(activeTheme.bgMode);
      ctx.lineHeight = typePairings[size.typePairing].headingLineheight;
      ctx.textAlign = align;

      // heading starting position is 200px from the bottom of the canvas
      const headingStartingPos = canvas.height;

      let wrappedText = wrapText(
        ctx,
        subheading,
        32,
        headingStartingPos,
        canvas.width - 64,
        Number(
          typePairings[size.typePairing].headingLineheight.replace(/px$/, "")
        )
      );
      wrappedText[0].forEach(function (item: any) {
        // We will fill our text which is item[0] of our array, at coordinates [x, y]
        // x will be item[1] of our array
        // y will be item[2] of our array, minus the line height (wrappedText[1]), minus the height of the emoji (200px)
        ctx.fillText(item[0], startPosition, item[2] - wrappedText[1] - 100); // 200 is height of an emoji
      });

      // Add our subheading text to the canvas
      ctx.font = typePairings[size.typePairing].subheading;

      ctx.lineHeight = typePairings[size.typePairing].subheadingLineheight;
      ctx.fillStyle = fgDefault(activeTheme.bgMode);

      const subheadingStartingPos = headingStartingPos;
      ctx.fillText(
        heading,
        startPosition,
        subheadingStartingPos - wrappedText[1] - 200
      );
    };

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const fps = 60;
    const width = size.w;
    const height = size.h;

    /**
     * TODO: This is realllllly inefficient. Find better way. */
    const interval = window.setInterval(() => {
      drawImage();
    }, 1000 / fps);

    function drawImage() {
      ctx.drawImage(video, 0, 0, width, height);

      video.play();
      renderText(canvas);
    }

    return () => {
      window.clearInterval(interval);
    };
  }, [heading, subheading, theme]);

  const router = useRouter();
  const id = router.query.id;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    type: string
  ) => {
    switch (type) {
      case "heading":
        setHeading(event.target.value);
        break;
      case "subheading":
        setSubheading(event.target.value);
        break;
      case "align":
        setAlign(event.target.value);
        break;
      case "size":
        const value = JSON.parse(event.target.value);
        setSize({ w: value.w, h: value.h, typePairing: value.typePairing });
        break;
      case "theme":
        setTheme(event.target.value);
        break;
    }
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

  const handleClear = (event) => {
    event.preventDefault();

    dispatch({ type: "clear_all", payload: 0 });

    if (formRef && formRef.current) {
      formRef.current.reset();
    }
  };

  return (
    <div className={[styles["container-editor"], "page"].join(" ")}>
      <Head>
        <title>Create social images</title>
      </Head>
      {/**Start sidebar */}

      <PopoverWizard
        title="Create your first social video"
        action="Got it!"
        description="Fill in these form fields to begin."
        visible={showWizard}
        handlePress={() => setShowWizard(false)}
        offsetY={125}
      />

      <Sidebar>
        <Sidebar.Inner>
          <form ref={formRef}>
            <Stack padding="none">
              <Box sx={{ padding: 4, paddingTop: 3 }}>
                <Stack direction="vertical" gap="condensed" padding="none">
                  <Flash variant="warning">
                    <StyledOcticon icon={AlertIcon} />
                    This template is experimental.
                  </Flash>
                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <FormControl fullWidth required id="heading">
                      <FormControl.Label>
                        Eyebrow
                        <CharCount max={50} cur={charCount.heading} />
                      </FormControl.Label>
                      <TextInput
                        className={styles["custom-input-background"]}
                        type="text"
                        fullWidth
                        maxLength={50}
                        onChange={(event) => {
                          handleChange(event, "heading");
                          handleCharCount(
                            event as unknown as ChangeEventHandler<HTMLInputElement>,
                            "heading"
                          );
                        }}
                      />
                      <FormControl.Hint>E.g. Save the date</FormControl.Hint>
                    </FormControl>
                  </Box>
                  <Box
                    sx={{
                      position: "relative",
                    }}
                  >
                    <FormControl fullWidth required id="subheading">
                      <FormControl.Label>
                        Heading
                        <CharCount max={75} cur={charCount.eyebrow} />
                      </FormControl.Label>
                      <TextInput
                        className={styles["custom-input-background"]}
                        type="text"
                        fullWidth
                        maxLength={75}
                        onChange={(event) => {
                          handleChange(event, "subheading");
                          handleCharCount(
                            event as unknown as ChangeEventHandler<HTMLInputElement>,
                            "eyebrow"
                          );
                        }}
                      />
                      <FormControl.Hint>
                        E.g. Universe 2023: Beyond code
                      </FormControl.Hint>
                    </FormControl>
                  </Box>

                  {/* <Box
                    as="hr"
                    sx={{
                      width: "100%",
                      border: 0,
                      borderTop: "1px solid var(--brand-color-border-default)",
                    }}
                  />

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
                    */}
                  <FormControl sx={{ mb: 3 }}>
                    <FormControl.Label>Theme</FormControl.Label>
                    <Select
                      name="color-mode"
                      fullWidth
                      defaultValue={theme}
                      onChange={(event) => handleChange(event, "theme")}
                    >
                      {themes.map((theme) => (
                        <Select.Option
                          key={theme.name}
                          value={theme.path}
                          selected={theme === theme.path}
                        >
                          {theme.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormControl>
                  {/*
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
                  /> */}
                </Stack>
              </Box>
              {/* <FormFooterControls
                isLoading={false}
                submitLabel={"Done"}
                handleClear={handleClear}
              /> */}
            </Stack>
          </form>
        </Sidebar.Inner>
      </Sidebar>

      <Canvas>
        <Canvas.Pannable>
          <canvas ref={canvasRef} width={size.w} height={size.h} />
          <Video videoRef={videoRef} src={theme} />
        </Canvas.Pannable>
      </Canvas>
    </div>
  );
};

export default CreateTemplate;
