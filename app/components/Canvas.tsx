import { PropsWithChildren, ReactElement } from "react";
import { Box, IconButton } from "@primer/react";
import {
  PlusIcon,
  DashIcon,
  ScreenNormalIcon,
  CopyIcon,
  DownloadIcon,
} from "@primer/octicons-react";
import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function Root({ children }: PropsWithChildren) {
  return (
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
          width: "100%",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

type PannableCanvasProps = {
  uri?: string;
  hasVideo?: () => JSX.Element;
  localPath?: string;
};

function PannableCanvas({
  uri,
  localPath,
  hasVideo,
  children,
}: PropsWithChildren<PannableCanvasProps>) {
  return (
    <TransformWrapper initialScale={0.8} minScale={0.2} centerOnInit>
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
            <IconButton size="large" icon={PlusIcon} onClick={() => zoomIn()} />
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
            {!hasVideo && !children && (
              <img
                src={uri}
                alt="social image"
                style={{ width: "100%", height: "auto" }}
              />
            )}

            {children && children}
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
}

type ThumbnailGridProps = {
  data: CsvData[];
  apiUrl: string;
};

type CsvData = {
  id: string;
  msg: string;
  path: string;
  uri: string;
};

function ThumbnailGrid({ data, apiUrl }: ThumbnailGridProps) {
  return (
    <Box sx={{ padding: 4 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: 5,
        }}
      >
        {data.length > 0 &&
          data.map((line) => {
            return (
              <Box
                key={line.id}
                as="a"
                href={apiUrl + line.path}
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
                    href={apiUrl + line.path}
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
    </Box>
  );
}

export const Canvas = Object.assign(Root, {
  Pannable: PannableCanvas,
  ThumbnailGrid,
});
