// /classroom-slides/common-package-resources/full
// /interaction-material/slides/v1/package-result/offline-structure
// import download from "download";
import downloadHandle from "download";


export const download = async (url: string, pathname: string) => {
  
  try {
    await downloadHandle(url, pathname);
    return true;
  } catch (error) {
    return false;
  }
};
