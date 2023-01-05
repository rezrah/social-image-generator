import { Label } from "@primer/react";

export function CharCount({ cur, max }: { cur: number; max: number }) {
  const getColor = () => {
    if (cur > max) {
      return "danger";
    }
    if (cur > max * 0.7) {
      return "severe";
    }
    if (cur > max * 0.5) {
      return "attention";
    }
    if (cur > 1) {
      return "success";
    }
    return "secondary";
  };

  return (
    <Label variant={getColor()} sx={{ position: "absolute", right: 0, top: 1 }}>
      {cur ? cur : 0}/{max}
    </Label>
  );
}
