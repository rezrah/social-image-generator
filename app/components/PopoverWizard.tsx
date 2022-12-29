import { Box, Popover, Button as ProductButton } from "@primer/react";
import { Heading, Text, Stack } from "@primer/react-brand";
import React, { PropsWithChildren } from "react";

type Props = {
  title: string;
  visible: boolean;
  description: string;
  action: string;
  handlePress: () => void;
};

export function PopoverWizard({
  visible,
  title,
  description,
  action,
  handlePress,
}: PropsWithChildren<Props>) {
  return (
    <Box
      position="fixed"
      pt={4}
      sx={{
        left: 375,
        top: 190,
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
