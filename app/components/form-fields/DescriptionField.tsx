import { FormControl, Textarea, TextInput } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLTextAreaElement>;
  required?: boolean;
  placeholder?: string;
};

export function DescriptionField({
  charCount,
  required = false,
  placeholder,
  handleCharCount,
}: Props) {
  return (
    <FormControl id="description" fullWidth required={required}>
      <Box sx={{ position: "relative" }}>
        <FormControl.Label>
          Description
          <CharCount max={150} cur={charCount} />
        </FormControl.Label>
      </Box>
      <Textarea
        className={styles["custom-input-background"]}
        maxLength={150}
        rows={4}
        fullWidth
        onChange={handleCharCount}
      />
      <FormControl.Hint>{placeholder}</FormControl.Hint>
    </FormControl>
  );
}
