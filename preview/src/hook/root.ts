import { CoursewareCommand } from "@play/render";
import { usePage } from "./page";
import { useHandleResize } from "./resize";
import { useRecoverController } from "./recover";
import { useRef } from "react";
import {signalling} from '../main'


const useHandleRootController = (setSize) => {
  const [setSlideInfo] = usePage();
  const [updateSize] = useHandleResize();
  const [recover] = useRecoverController();

  const handles = (info) => {
    const { type, param } = info;
    console.log("useHandleRootController", type);
    switch (type) {
      case CoursewareCommand.SetPageId:
        console.log("useHandleRootController", CoursewareCommand.SetPageId);
        setSlideInfo(param);
        break;
      case CoursewareCommand.ResizeCW:
        console.log("useHandleRootController", CoursewareCommand.ResizeCW);
        updateSize(param, setSize);
        break;
      case CoursewareCommand.RecoverCWState:
        console.log("useHandleRootController", CoursewareCommand.RecoverCWState);
        recover(param, signalling);
        break;
      case CoursewareCommand.SetPageUseAble:
        // setUseAbleController();
        break;
    }
  };
  return [handles];
};

export const useRootController = (setSize) => {
  const [handles] = useHandleRootController(setSize);
  const flag = useRef(false)
  if (!flag.current) {
    flag.current = true
    window.microApp.addDataListener(handles, true);
  }
};
