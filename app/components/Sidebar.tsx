import { Box } from "@primer/react";
import { PropsWithChildren } from "react";

function Root({ children }: PropsWithChildren) {
  return (
    <Box
      sx={{
        overflow: "hidden",
        borderRadius: "6px",
      }}
    >
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
          border: "1px solid var(--brand-color-border-default)",
          boxShadow:
            "0 0 0 1px var(--brand-SubdomainNavBar-canvas-default), 0 4px 16px rgba(0, 0, 0, 0.24)",

          // boxShadow: "0 12px 28px rgba(140,149,159,0.3)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

function Inner({ children }: PropsWithChildren) {
  return (
    <Box sx={{ height: "100%", overflowY: "auto", paddingBottom: "130px" }}>
      {children}
    </Box>
  );
}

export const Sidebar = Object.assign(Root, {
  Inner,
});
