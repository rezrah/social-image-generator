import { FormControl, TextInput } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLInputElement>;
};

export function EyebrowField({ charCount, handleCharCount }: Props) {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <FormControl fullWidth required id="subheading">
        <FormControl.Label>
          Eyebrow
          <CharCount max={50} cur={charCount} />
        </FormControl.Label>
        <TextInput
          className={styles["custom-input-background"]}
          type="text"
          name="subheading"
          required
          placeholder="E.g. Enterprise Security"
          maxLength={50}
          fullWidth
          onChange={handleCharCount}
        />
      </FormControl>
    </Box>
  );
}
