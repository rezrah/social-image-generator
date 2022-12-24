import { Label } from "@primer/react";

export function CharCount({ cur, max }: { cur: number; max: number }) {
  return (
    <Label
      variant={cur > 0 ? "accent" : "secondary"}
      sx={{ position: "absolute", right: 0, top: 1 }}
    >
      {cur ? cur : 0}/{max}
    </Label>
  );
}
