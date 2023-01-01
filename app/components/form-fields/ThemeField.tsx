import { FormControl, Select, TextInput } from "@primer/react-brand";
import { ChangeEventHandler } from "react";

import styles from "./form-fields.module.css";

type Props = {
  handleChange: ChangeEventHandler<HTMLSelectElement>;
};

export function ThemeField({ handleChange }: Props) {
  return (
    <FormControl id="color-mode">
      <FormControl.Label>Theme</FormControl.Label>
      <Select
        className={styles["custom-input-background"]}
        fullWidth
        defaultValue="dark"
        onChange={handleChange}
      >
        <Select.Option value="light">Light</Select.Option>
        <Select.Option value="dark">Dark</Select.Option>
        <Select.Option value="analog">Analog</Select.Option>
        <Select.Option value="policy">Policy</Select.Option>
        <Select.Option value="universe">Universe</Select.Option>
        <Select.Option value="copilot">Copilot</Select.Option>
        <Select.Option value="education">Education</Select.Option>
        {/* <Select.Option value="custom">Custom</Select.Option> */}
      </Select>
    </FormControl>
  );
}
