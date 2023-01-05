import Canvas from "@napi-rs/canvas";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { roundRect } from "./prepare-rounded-rectangle.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const drawCallToActionButton = async function ({
  theme,
  canvas,
  label,
  align,
  offsetY,
}) {
  const ctx = canvas.getContext("2d");
  const hasLightButton = ["light", "policy"].includes(theme);

  ctx.font = "20px AllianceNo1SemiBold";
  const txt = label;
  const rectHeight = 56;
  const rectWidth = ctx.measureText(txt).width + 48;
  const rectX = align === "center" ? canvas.width / 2 - rectWidth / 2 : 48;
  const rectY = offsetY;

  let buttonGradient = ctx.createLinearGradient(300, 0, 300, 200);

  if (hasLightButton) {
    ctx.lineWidth = 1;
    ctx.fillStyle = "#1B1F23";
    ctx.strokeStyle = "#000000";
  } else {
    ctx.fillStyle = "#F6F8FA";
  }

  roundRect(ctx, rectX, rectY, rectWidth, rectHeight, 6, true);

  if (hasLightButton) {
    buttonGradient.addColorStop(0, "rgba(255, 255, 255, 0.1)");
    buttonGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  } else {
    buttonGradient.addColorStop(0, "#FFFFFF");
    buttonGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  }

  ctx.fillStyle = buttonGradient;

  roundRect(ctx, rectX, rectY, rectWidth, rectHeight, 6, true);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = hasLightButton ? "#fff" : "#000";

  ctx.fillText(txt, rectX + rectWidth / 2, rectY - 2 + rectHeight / 2);
};
