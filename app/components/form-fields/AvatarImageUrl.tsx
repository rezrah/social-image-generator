import { FormControl, Stack, TextInput, Text } from "@primer/react-brand";
import { Box } from "@primer/react";
import { ChangeEventHandler, useState } from "react";
import { CharCount } from "../CharCount";

import styles from "./form-fields.module.css";
import { PersonIcon } from "@primer/octicons-react";
import Image from "next/image";

type Props = {
  charCount: number;
  handleCharCount: ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  placeholder?: string;
};

export function AvatarImageUrl({
  charCount,
  handleCharCount,
  required = true,
  placeholder,
}: Props) {
  const [avatarImageUrl, setAvatarImageUrl] = useState<string>("");

  const handleAvatarImageUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
    const avatarImageUrl = event.target.value;

    setAvatarImageUrl(avatarImageUrl);
  };

  return (
    <>
      <Stack
        direction="horizontal"
        gap="condensed"
        padding="none"
        alignItems="center"
      >
        <Box
          sx={{
            border: "1px solid var(--brand-color-border-default)",
            color: "var(--brand-color-border-default)",
            height: 48,
            width: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: avatarImageUrl
              ? "url(" + avatarImageUrl + ") center center / cover no-repeat"
              : "var(--base-color-scale-gray-2)",
          }}
        >
          {!avatarImageUrl && <PersonIcon size={24} />}
        </Box>
        <Box
          sx={{
            position: "relative",
            width: "calc(100% - 64px)",
          }}
        >
          <FormControl fullWidth id="imageurl">
            <FormControl.Label>
              Avatar URL
              <CharCount max={75} cur={charCount} />
            </FormControl.Label>
            <TextInput
              className={styles["custom-input-background"]}
              type="text"
              maxLength={75}
              placeholder="E.g. https://github.com/rezrah.png"
              onChange={(event) => {
                handleAvatarImageUrl(event);
                handleCharCount(event);
              }}
            />
          </FormControl>
        </Box>
      </Stack>
    </>
  );
}
