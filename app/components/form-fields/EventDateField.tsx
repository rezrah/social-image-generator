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

export function EventDateField({
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
      <FormControl fullWidth id="event_date" required>
        <FormControl.Label>
          Event date
          <CharCount max={50} cur={charCount} />
        </FormControl.Label>
        <TextInput
          type="text"
          className={styles["custom-input-background"]}
          fullWidth
          required={required}
          maxLength={75}
          onChange={handleCharCount}
        />
        <FormControl.Hint>{placeholder}</FormControl.Hint>
      </FormControl>
    </Box>
  );
}
