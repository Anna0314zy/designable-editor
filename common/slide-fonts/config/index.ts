export interface IConfig {
  version: string;
  fileName: string;
  fontName: string;
  fontFamily: string;
  downgrade?: string[];
  fallback?: boolean;
}
export const config: IConfig[] = [
  {
    fontName: "宋体",
    version: "1.0",
    fileName: "simsun",
    fontFamily: "SimSun",
  },
  {
    fontName: "方正准圆简体",
    version: "1.0",
    fileName: "simFZzhunyuan",
    fontFamily: "SimFZzhunyuan",
    downgrade: ["SimSun"],
  },
  {
    fontName: "方正粗圆简体",
    version: "1.0",
    fileName: "simFZcuyuan",
    fontFamily: "SimFZcuyuan",
    downgrade: ["SimSun"],
  },
];
