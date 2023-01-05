import { FormControl, TextInput } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  placeholder?: string;
};

export function EyebrowField({
  charCount,
  handleCharCount,
  required = false,
  placeholder,
}: Props) {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <FormControl fullWidth required={required} id="subheading">
        <FormControl.Label>
          Eyebrow
          <CharCount max={50} cur={charCount} />
        </FormControl.Label>
        <TextInput
          className={styles["custom-input-background"]}
          type="text"
          name="subheading"
          required={required}
          maxLength={50}
          fullWidth
          onChange={handleCharCount}
        />
        <FormControl.Hint>{placeholder}</FormControl.Hint>
      </FormControl>
    </Box>
  );
}
