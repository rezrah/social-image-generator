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

export function HeadingField({
  charCount,
  handleCharCount,
  required = true,
  placeholder,
}: Props) {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <FormControl fullWidth required={required} id="heading">
        <FormControl.Label>
          Heading
          <CharCount max={75} cur={charCount} />
        </FormControl.Label>
        <TextInput
          className={styles["custom-input-background"]}
          type="text"
          fullWidth
          maxLength={75}
          onChange={handleCharCount}
        />
        <FormControl.Hint>{placeholder}</FormControl.Hint>
      </FormControl>
    </Box>
  );
}
