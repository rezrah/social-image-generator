import { FormControl, Select, TextInput } from "@primer/react-brand";
import { ChangeEventHandler } from "react";

import styles from "./form-fields.module.css";

type SupportedSize = { w: number; h: number; typePairing: string };

type Props = {
  supportedSizes: SupportedSize[];
  handleChange: ChangeEventHandler<HTMLSelectElement>;
};

export function SizeField({ supportedSizes, handleChange }: Props) {
  const formattedSizes = supportedSizes.map(({ w, h }) => `${w}x${h}`);

  return (
    <FormControl id="size">
      <FormControl.Label>Size</FormControl.Label>
      <Select
        className={styles["custom-input-background"]}
        fullWidth
        defaultValue={JSON.stringify(supportedSizes[0])}
        onChange={handleChange}
      >
        {formattedSizes.map((size: string, index: number) => (
          <Select.Option
            value={JSON.stringify(supportedSizes[index])}
            key={size}
          >
            {size}
          </Select.Option>
        ))}
      </Select>
    </FormControl>
  );
}
