import { FormControl, Textarea, TextInput } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
};

export function ButtonField({
  charCount,
  handleCharCount,
  placeholder,
}: Props) {
  return (
    <FormControl id="button" fullWidth>
      <Box sx={{ position: "relative" }}>
        <FormControl.Label>
          Button call to action
          <CharCount max={100} cur={charCount} />
        </FormControl.Label>
      </Box>
      <TextInput
        className={styles["custom-input-background"]}
        type="text"
        maxLength={100}
        onChange={handleCharCount}
      />
      <FormControl.Hint>{placeholder}</FormControl.Hint>
    </FormControl>
  );
}
