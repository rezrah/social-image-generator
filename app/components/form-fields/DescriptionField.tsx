import { FormControl, Textarea, TextInput } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLTextAreaElement>;
};

export function DescriptionField({ charCount, handleCharCount }: Props) {
  return (
    <FormControl id="description" fullWidth>
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
        placeholder="E.g. Over 56M developers worldwide depend on GitHub as the most complete, secure, compliant, and loved developer platform."
        onChange={handleCharCount}
      />
    </FormControl>
  );
}
