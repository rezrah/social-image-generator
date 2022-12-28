import React, { ChangeEvent, useCallback } from "react";
import {
  Box,
  ButtonGroup,
  IconButton,
  RadioGroup,
  Radio,
  FormControl as ProductFormControl,
} from "@primer/react";

import { CenterAlign } from "../icons/CenterAlign";
import { LeftAlign } from "../icons/LeftAlign";

type Props = {};

export function AlignmentField({}: Props) {
  const [selectedRadioValue, setSelectedRadioValue] = React.useState<
    "start" | "center"
  >("start");

  const handleRadioGroupChange = useCallback(
    (newValue: string | null, e: ChangeEvent<HTMLInputElement> | undefined) => {
      setSelectedRadioValue(newValue as "start" | "center");
    },
    []
  );

  return (
    <RadioGroup name="text-alignment" onChange={handleRadioGroupChange}>
      <RadioGroup.Label sx={{ fontWeight: 600, fontSize: 1 }}>
        Alignment
      </RadioGroup.Label>
      <ButtonGroup>
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          variant={selectedRadioValue === "start" ? "outline" : "default"}
          icon={LeftAlign}
          aria-label="Align start"
          onClick={(e: any) => {
            e.preventDefault();
            handleRadioGroupChange("start", e);
          }}
        />
        <IconButton
          sx={{ display: "flex", alignItems: "center" }}
          variant={selectedRadioValue === "center" ? "outline" : "default"}
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
          <ProductFormControl.Label>Start</ProductFormControl.Label>
        </ProductFormControl>
        <ProductFormControl>
          <Radio
            value="center"
            name="text-alignment"
            checked={selectedRadioValue === "center"}
          />
          <ProductFormControl.Label>Center</ProductFormControl.Label>
        </ProductFormControl>
      </Box>
    </RadioGroup>
  );
}
