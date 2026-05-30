import { config, IConfig } from "./config";

// Path: common/slide-fonts/index.ts

export enum FontFormatCollection {
  woff = "woff",
  woff2 = "woff2",
  ttf = "ttf",
  svg = "svg",
}

type fontFormatType = keyof typeof FontFormatCollection;

const fontFormatMap = {
  [FontFormatCollection.woff]: "woff",
  [FontFormatCollection.woff2]: "woff2",
  [FontFormatCollection.ttf]: "truetype",
  [FontFormatCollection.svg]: "svg",
};

export const createFontFamilyOptions = () => {
  return config.map((item) => {
    return {
      label: item.fontName,
      value: [item.fontFamily]
        .concat(Array.isArray(item.downgrade) ? item.downgrade : [])
        .join(","),
    };
  });
};

const createFontFaceUrl = (
  baseDir: string,
  fileName: string,
  fontFormatList: fontFormatType[]
) => {
  return fontFormatList.reduce((prev, format, index) => {
    return `${prev}url('${baseDir}/fonts/${fileName}/${fileName}.${format}') ${
      index === fontFormatList.length - 1 ? ";" : ","
    }`;
  }, "");
};

const createFontFaceStyleText = (
  config: IConfig[],
  baseDir: string,
  fontFormatList: fontFormatType[]
) => {
  return config.reduce((prev, item) => {
    return `${prev}
      @font-face {
        font-display:swap;
        font-family: '${item.fontFamily}';
        src: ${createFontFaceUrl(baseDir, item.fileName, fontFormatList)}
      }
    `;
  }, "");
};

export const fontBootstrap = (
  config: IConfig[],
  baseDir: string,
  fontFormatList: fontFormatType[]
) => {
  const style = document.createElement("style");
  style.innerHTML = createFontFaceStyleText(config, baseDir, fontFormatList);
  document.head.appendChild(style);
};

export const fontConfigList = config;
