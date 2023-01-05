import { FormControl, Textarea } from "@primer/react-brand";
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

export function HeadingField({
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
      <FormControl fullWidth required={required} id="heading">
        <FormControl.Label>
          Heading
          <CharCount max={100} cur={charCount} />
        </FormControl.Label>
        <Textarea
          className={styles["custom-input-background"]}
          fullWidth
          maxLength={100}
          onChange={handleCharCount}
          rows={3}
        />
        <FormControl.Hint>{placeholder}</FormControl.Hint>
      </FormControl>
    </Box>
  );
}
