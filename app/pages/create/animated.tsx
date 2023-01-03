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
import Image from "next/image";
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
  const canvasRef = React.useRef(null);
  const videoRef = React.useRef(null);
  const [heading, setHeading] = React.useState("");
  const [subheading, setSubheading] = React.useState("");
  const [size, setSize] = React.useState(sizes[0]);
  const [align, setAlign] = React.useState("left");
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [theme, setTheme] = React.useState("/animated-2.mov");
  const [showWizard, setShowWizard] = useLocalStorageState("showWizard", {
    defaultValue: true,
  });

  const [charCount, dispatch] = React.useReducer(
    charCountReducer,
    charCountInitialStates
  );

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

      ctx.font = typePairings[size.typePairing].heading;
      ctx.fillStyle = fgDefault(theme);
      ctx.lineHeight = typePairings[size.typePairing].headingLineheight;
      ctx.textAlign = align;

      const headingStartingPos = size.typePairing === "large" ? 923 : 623;

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
        ctx.fillText(item[0], startPosition, item[2] - wrappedText[1] - 200); // 200 is height of an emoji
      });

      // Add our subheading text to the canvas
      ctx.font = typePairings[size.typePairing].subheading;

      ctx.lineHeight = typePairings[size.typePairing].subheadingLineheight;
      ctx.fillStyle = fgDefault(theme);

      const subheadingStartingPos = size.typePairing === "large" ? 800 : 520;
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
  }, [heading, subheading, align, size]);

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
                      <Select.Option
                        value="/animated-1.mov"
                        selected={theme === "/animated-1.mov"}
                      >
                        Universe one
                      </Select.Option>
                      <Select.Option
                        value="/animated-2.mov"
                        selected={theme === "/animated-2.mov"}
                      >
                        Universe two
                      </Select.Option>
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
          <video
            ref={videoRef}
            src={theme}
            preload="auto"
            autoPlay
            playsInline
            muted
            hidden
          ></video>
        </Canvas.Pannable>
      </Canvas>
    </div>

    // <div className={[styles.container, "page"].join(" ")}>
    //   <Head>
    //     <title>Create social images</title>
    //   </Head>

    //   <PageLayout containerWidth="full">
    //     <PageLayout.Header>
    //       <Heading as="h3">Animated banner</Heading>
    //       <Box sx={{ position: "relative" }}>
    //         <TabNav aria-label="Main" sx={{ mt: 6 }}>
    //           <TabNav.Link
    //             href="#"
    //             selected
    //             onClick={(event) => console.log("pressed")}
    //             sx={{
    //               fontWeight: 600,
    //             }}
    //           >
    //             Customize
    //           </TabNav.Link>
    //           <TabNav.Link
    //             href="#"
    //             onClick={(event) => console.log("pressed")}
    //             selected={false}
    //             sx={{
    //               fontWeight: "normal",
    //             }}
    //           >
    //             Upload CSV
    //           </TabNav.Link>
    //         </TabNav>
    //         <Box>
    //           <Box
    //             sx={{
    //               position: "absolute",
    //               top: -1,
    //               right: 0,
    //               display: "grid",
    //               gap: 0,
    //               gridTemplateColumns: "1fr 1fr",
    //               width: 310,
    //             }}
    //           >
    //             <ProductLinkButton
    //               disabled
    //               variant="default"
    //               sx={{ mr: 2 }}
    //               leadingIcon={ShareIcon}
    //             >
    //               Share video
    //             </ProductLinkButton>
    //             <ProductLinkButton
    //               variant="primary"
    //               disabled
    //               leadingIcon={DownloadIcon}
    //               href="#"
    //               download
    //               target="_blank"
    //             >
    //               Download video
    //             </ProductLinkButton>
    //           </Box>
    //         </Box>
    //       </Box>
    //     </PageLayout.Header>

    //     <PageLayout.Pane position="start" divider="line">
    //       <form>
    //         <FormControl sx={{ mb: 3 }}>
    //           <FormControl.Label>Theme</FormControl.Label>
    //           <Select
    //             name="color-mode"
    //             block
    //             defaultValue={theme}
    //             onChange={(event) => handleChange(event, "theme")}
    //           >
    //             <Select.Option
    //               value="/animated-1.mov"
    //               selected={theme === "/animated-1.mov"}
    //             >
    //               Universe one
    //             </Select.Option>
    //             <Select.Option
    //               value="/animated-2.mov"
    //               selected={theme === "/animated-2.mov"}
    //             >
    //               Universe two
    //             </Select.Option>
    //           </Select>
    //         </FormControl>
    //         <Box sx={{ mb: 3 }}>
    //           <RadioGroup name="choiceGroup">
    //             <RadioGroup.Label sx={{ fontWeight: 600, fontSize: 1 }}>
    //               Alignment
    //             </RadioGroup.Label>
    //             <Box sx={{ display: "inline-flex" }}>
    //               <FormControl sx={{ mr: 3 }}>
    //                 <Radio
    //                   value="left"
    //                   name="text-alignment"
    //                   defaultChecked={"left" === align}
    //                   onChange={(event) => handleChange(event, "align")}
    //                 />
    //                 <FormControl.Label>Start</FormControl.Label>
    //               </FormControl>
    //               <FormControl>
    //                 <Radio
    //                   value="center"
    //                   name="text-alignment"
    //                   defaultChecked={"center" === align}
    //                   onChange={(event) => handleChange(event, "align")}
    //                 />
    //                 <FormControl.Label>Center</FormControl.Label>
    //               </FormControl>
    //             </Box>
    //           </RadioGroup>
    //         </Box>

    //         <Box sx={{ mb: 3 }}>
    //           <RadioGroup name="choiceGroup">
    //             <RadioGroup.Label sx={{ fontWeight: 600, fontSize: 1 }}>
    //               Size
    //             </RadioGroup.Label>
    //             <Box sx={{ display: "inline-flex" }}>
    //               {formattedSizes.map((size, index) => (
    //                 <FormControl sx={{ mr: 3 }} key={size}>
    //                   <Radio
    //                     value={JSON.stringify(sizes[index])}
    //                     name="size"
    //                     defaultChecked={index === 0}
    //                     onChange={(event) => handleChange(event, "size")}
    //                   />
    //                   <FormControl.Label>{size}</FormControl.Label>
    //                 </FormControl>
    //               ))}
    //             </Box>
    //           </RadioGroup>
    //         </Box>

    //         <FormControl sx={{ mb: 3 }} required id="heading">
    //           <FormControl.Label>Heading</FormControl.Label>
    //           <TextInput
    //             type="text"
    //             name="heading"
    //             block
    //             value={heading}
    //             onChange={(event) => handleChange(event, "heading")}
    //           />
    //         </FormControl>

    //         <FormControl sx={{ mb: 3 }} required>
    //           <FormControl.Label>Sub-heading</FormControl.Label>
    //           <TextInput
    //             type="text"
    //             id="subheading"
    //             name="subheading"
    //             block
    //             value={subheading}
    //             onChange={(event) => handleChange(event, "subheading")}
    //           />
    //         </FormControl>
    //         <FormControl sx={{ mb: 3 }} id="description">
    //           <FormControl.Label>Description</FormControl.Label>
    //           <Textarea name="description" block />
    //         </FormControl>
    //         <FormControl sx={{ mb: 3 }} id="button">
    //           <FormControl.Label>Call to action</FormControl.Label>
    //           <TextInput type="text" name="button" block />
    //         </FormControl>
    //       </form>
    //     </PageLayout.Pane>

    //     <PageLayout.Content>
    //       <>
    //         <Box
    //           sx={{
    //             position: "relative",
    //             borderWidth: 1,
    //             borderStyle: "solid",
    //             borderRadius: "5px",
    //             borderColor: "border.default",
    //             backgroundColor: "canvas.subtle",
    //             minHeight: 600,
    //             backgroundImage:
    //               "radial-gradient(#000000 13%,var(--base-color-scale-gray-7) 13%)",
    //             backgroundPosition: "0 0",
    //             backgroundSize: "20px 20px",
    //             // backgroundImage:
    //             //   "linear-gradient(45deg, var(--base-color-scale-gray-2) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--base-color-scale-gray-2) 75%), linear-gradient(45deg, transparent 75%, var(--base-color-scale-gray-2) 75%), linear-gradient(45deg, var(--base-color-scale-gray-2) 25%, transparent 25%)",
    //             // backgroundSize: "20px 20px",
    //             // backgroundPosition: "0 0, 0 0, -50px -50px, 50px 50px",
    //             width: "100%",
    //           }}
    //         >
    //           {/* {!uri && (
    //           <Box
    //             sx={{
    //               display: "flex",
    //               alignItems: "center",
    //               justifyContent: "center",
    //               height: "100%",
    //               minHeight: 600,
    //             }}
    //           >
    //             <ImageIcon size={128} fill="#21252c" />
    //           </Box>
    //         )} */}
    //           <TransformWrapper initialScale={0.8} minScale={0.2} centerOnInit>
    //             {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
    //               <React.Fragment>
    //                 <Box
    //                   sx={{
    //                     position: "absolute",
    //                     right: 3,
    //                     top: 3,
    //                     display: "grid",
    //                     width: "auto",
    //                     gap: 1,
    //                   }}
    //                 >
    //                   <IconButton
    //                     size="large"
    //                     icon={PlusIcon}
    //                     onClick={() => zoomIn()}
    //                   />
    //                   <IconButton
    //                     size="large"
    //                     icon={DashIcon}
    //                     onClick={() => zoomOut()}
    //                   />
    //                   <IconButton
    //                     size="large"
    //                     icon={ScreenNormalIcon}
    //                     onClick={() => resetTransform()}
    //                   />
    //                 </Box>
    //                 <TransformComponent>
    //                   <canvas ref={canvasRef} width={size.w} height={size.h} />
    //                   <video
    //                     ref={videoRef}
    //                     src={theme}
    //                     preload="auto"
    //                     autoPlay
    //                     playsInline
    //                     muted
    //                     hidden
    //                   ></video>
    //                 </TransformComponent>
    //               </React.Fragment>
    //             )}
    //           </TransformWrapper>
    //         </Box>
    //       </>
    //     </PageLayout.Content>

    //     {/* <PageLayout.Footer>Footer</PageLayout.Footer> */}
    //   </PageLayout>
    // </div>
  );
};

export default CreateTemplate;
