import { Box, Popover, Button as ProductButton } from "@primer/react";
import { Heading, Text, Stack } from "@primer/react-brand";
import React, { PropsWithChildren } from "react";

import styles from "./PopoverWizard.module.css";

type Props = {
  title: string;
  visible: boolean;
  description: string;
  action: string;
  handlePress: () => void;
  offsetY?: number;
};

export function PopoverWizard({
  visible,
  title,
  description,
  action,
  handlePress,
  offsetY = 190,
}: PropsWithChildren<Props>) {
  return (
    <Box
      className={styles["popover-wizard"]}
      position="fixed"
      pt={4}
      sx={{
        left: 375,
        top: offsetY,
        width: 300,
        zIndex: 2,
      }}
    >
      <Popover
        open={visible}
        caret="left-top"
        sx={{
          borderRadius: 6,
          boxShadow:
            "0 0 0 1px var(--brand-SubdomainNavBar-canvas-default), 0 4px 16px rgba(0, 0, 0, 0.24)",
        }}
      >
        <Popover.Content sx={{ margin: 0 }}>
          <Stack direction="vertical" padding="none" gap="condensed">
            <Heading as="h6">{title}</Heading>
            <Text as="p" size="300">
              {description}
            </Text>
            <ProductButton
              onClick={handlePress}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignSelf: "flex-start",
              }}
            >
              {action}
            </ProductButton>
          </Stack>
        </Popover.Content>
      </Popover>
    </Box>
  );
}
