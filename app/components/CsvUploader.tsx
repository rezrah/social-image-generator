import { PropsWithChildren, useEffect } from "react";
import React from "react";
import { Box, Button, Flash, Spinner } from "@primer/react";
import csvtojson from "csvtojson";

import {
  PlusIcon,
  DashIcon,
  ScreenNormalIcon,
  CopyIcon,
  DownloadIcon,
  UploadIcon,
} from "@primer/octicons-react";
import { Heading, Stack, Text } from "@primer/react-brand";

type CsvData = {
  id: string;
  msg: string;
  path: string;
  uri: string;
};

type RootProps = {
  hasPreviouslyUploaded: boolean;
  uploaderRef: React.RefObject<HTMLInputElement>;
  csvDataCallback: React.Dispatch<React.SetStateAction<CsvData[] | undefined>>;
  iterator: (item: any) => Promise<any>;
};

function Root({
  hasPreviouslyUploaded,
  uploaderRef,
  csvDataCallback,
  iterator,
}: PropsWithChildren<RootProps>) {
  const [fileRawData, setFileRawData] = React.useState<
    string | ArrayBuffer | undefined
  >();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onCompleteCallback = (csvOutput: string | ArrayBuffer) => {
    setFileRawData(csvOutput);
  };

  useEffect(() => {
    const getData = async () => {
      if (typeof fileRawData === "string") {
        !isLoading && setIsLoading(true);
        try {
          const csvdata = await csvtojson().fromString(fileRawData);

          const images = await Promise.all(csvdata.map(iterator));

          if (images.length) {
            csvDataCallback(images);
            setIsLoading(false);
          }
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }
    };

    if (fileRawData) {
      getData();
    }
  }, [fileRawData]);

  /*
   * Reset file uploader
   */
  useEffect(() => {
    if (uploaderRef && uploaderRef.current) {
      uploaderRef.current.value = "";
    }
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const fileReader = new FileReader();
    const file = e.target.files[0];

    fileReader.onloadend = (e) => {
      const csvOutput = e.target.result;
      if (csvOutput) {
        onCompleteCallback(csvOutput);
      }
    };

    fileReader.readAsText(file);
  };

  return (
    <Box>
      <Flash sx={{ m: 4 }}>
        <Stack direction="vertical" padding="none" gap="condensed">
          <Heading as="h4" size="6">
            Download sample .csv
          </Heading>
          <Text size="200">
            Modify the content of this example .csv file and upload it to
            generate new images.
          </Text>
          <div>
            <Button
              as="a"
              href="/fixtures/sample.csv"
              download
              target="_blank"
              size="medium"
              variant="primary"
            >
              Download
            </Button>
          </div>
        </Stack>
      </Flash>
      <form>
        <Box
          ref={uploaderRef}
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
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <Box sx={{ display: "block", fill: "fg.subtle" }}>
                <UploadIcon size={24} fill="inherit" />
              </Box>
              <Text size="300" variant="muted">
                Upload {hasPreviouslyUploaded ? "another" : "your"} .csv file
              </Text>
            </>
          )}
        </Box>
      </form>
      {hasPreviouslyUploaded && (
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
          <Button sx={{ mr: 2 }}>Sync to Drive</Button>
          <Button variant="primary" leadingIcon={DownloadIcon} sx={{}}>
            Download all
          </Button>
        </Box>
      )}
    </Box>
  );
}

export const CsvUploader = Object.assign(Root, {});
