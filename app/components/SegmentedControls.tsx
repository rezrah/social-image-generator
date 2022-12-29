import { SegmentedControl } from "@primer/react";
import { Box } from "@primer/react";
import React from "react";

export function useSegmentedControls(): [
  number,
  React.Dispatch<React.SetStateAction<number>>
] {
  const [activeTab, setActiveTab] = React.useState(0);

  return [activeTab, setActiveTab];
}

export function SegmentedControls({
  handler,
  activeTab,
  labelOne,
  labelTwo,
  disable,
}: {
  handler: (activeTab: number) => void;
  activeTab: number;
  labelOne: string;
  labelTwo: string;
  disable?: boolean[];
}) {
  return (
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
        onChange={handler}
      >
        <SegmentedControl.Button defaultSelected selected={activeTab === 0}>
          {labelOne}
        </SegmentedControl.Button>
        <SegmentedControl.Button
          selected={activeTab === 1}
          disabled={disable && disable[1]}
        >
          {labelTwo}
        </SegmentedControl.Button>
      </SegmentedControl>
    </Box>
  );
}
