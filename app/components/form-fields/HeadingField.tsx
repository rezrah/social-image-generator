import { FormControl, TextInput } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLInputElement>;
};

export function HeadingField({ charCount, handleCharCount }: Props) {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <FormControl fullWidth required id="heading">
        <FormControl.Label>
          Heading
          <CharCount max={75} cur={charCount} />
        </FormControl.Label>
        <TextInput
          className={styles["custom-input-background"]}
          type="text"
          placeholder="E.g. Everything developers love"
          fullWidth
          maxLength={75}
          onChange={handleCharCount}
        />
      </FormControl>
    </Box>
  );
}
