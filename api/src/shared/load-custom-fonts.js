import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function loadCustomFonts(GlobalFonts) {
  // Load in the fonts we need
  GlobalFonts.registerFromPath(
    path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-Regular.woff2"),
    "AllianceNo1Regular"
  );
  GlobalFonts.registerFromPath(
    path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-Medium.woff2"),
    "AllianceNo1Medium"
  );
  GlobalFonts.registerFromPath(
    path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-SemiBold.woff2"),
    "AllianceNo1SemiBold"
  );
  GlobalFonts.registerFromPath(
    path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-Bold.woff2"),
    "AllianceNo1Bold"
  );
  GlobalFonts.registerFromPath(
    path.resolve(__dirname, "../../shared/fonts/Alliance-No-1-ExtraBold.woff2"),
    "AllianceNo1ExtraBold"
  );
}
