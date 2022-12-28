import { Box, Spinner, Button as ProductButton } from "@primer/react";

type Props = {
  isLoading: boolean;
  handleClear: (event: any) => void;
  submitLabel: string;
};

export function FormFooterControls({
  isLoading,
  handleClear,
  submitLabel,
}: Props) {
  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        alignSelf: "flex-end",
        justifyContent: "flex-end",
        position: "absolute",
        bottom: "0px",
        left: "0px",
        right: "0px",
        backgroundColor: "var(--brand-color-canvas-subtle)",
        width: "calc(100%)",
        padding: 3,
        borderTop: "1px solid var(--brand-color-border-default)",
      }}
    >
      {isLoading && (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Spinner size="small" sx={{ mr: 2 }} />
        </Box>
      )}
      <ProductButton
        type="submit"
        variant="default"
        sx={{ mr: 2 }}
        onClick={handleClear}
      >
        Clear
      </ProductButton>
      <ProductButton disabled={isLoading} type="submit" variant="primary">
        {submitLabel}
      </ProductButton>
    </Box>
  );
}
