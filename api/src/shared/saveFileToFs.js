import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description Save file to file system
 * @param {object} params object
 * @param {string} params.outDir
 * @param {number} params.width
 * @param {number} params.height
 * @param {Canvas} params.canvas
 * @param {string} params.canonicalName
 * @param {boolean} params.overwrite
 * @returns {Promise<{msg: string, path: string, uri: string}>}
 */
export async function saveFileToFs({
  outDir = "../../views/images/banner/",
  width,
  height,
  canvas,
  canonicalName,
  overwrite = false,
}) {
  const fullOutDir = path.resolve(__dirname, outDir);

  if (!fs.existsSync(fullOutDir)) {
    fs.mkdirSync(fullOutDir, { recursive: true });
  }

  const mime = "image/png";
  const encoding = "base64";
  const canvasData = await canvas.encode("png");

  const uri =
    "data:" + mime + ";" + encoding + "," + canvasData.toString(encoding);

  if (
    fs.existsSync(`${fullOutDir}/${canonicalName}-${width}x${height}.png`) &&
    !overwrite
  ) {
    console.info("Images Exist! We did not create any");
    return;
  } else {
    try {
      // Save file
      fs.writeFileSync(
        `${fullOutDir}/${canonicalName}-${width}x${height}.png`,
        canvasData
      );

      console.info("Images created successfully");
    } catch (e) {
      console.error("Could not save the image this time.", e);
      return;
    }
    const serverPath = `/banner/${canonicalName}-${width}x${height}.png`;

    return {
      msg: "Images have been successfully created!",
      path: serverPath,
      uri,
    };
  }
}
