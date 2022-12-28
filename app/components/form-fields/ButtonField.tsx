import { FormControl, Textarea, TextInput } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLInputElement>;
};

export function ButtonField({ charCount, handleCharCount }: Props) {
  return (
    <FormControl id="button" fullWidth>
      <Box sx={{ position: "relative" }}>
        <FormControl.Label>
          Button label
          <CharCount max={25} cur={charCount} />
        </FormControl.Label>
      </Box>
      <TextInput
        className={styles["custom-input-background"]}
        type="text"
        placeholder="E.g. Contact sales"
        maxLength={25}
        onChange={handleCharCount}
      />
    </FormControl>
  );
}
