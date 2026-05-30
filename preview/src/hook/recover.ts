import { getEventStore, CoursewareEvent } from "@play/render";
import { handleSendMessage } from "../utils";
import { useRef } from "react";

export const useRecoverController = () => {
  const uuid = useRef("");
  const recover = (param, signalling) => {
    const { msgControllerList} = getEventStore()
    console.log("file: recover.ts:9 ~ recover ~ param:", param)
    if(uuid.current !== param.uuid) {
      console.log("file: recover.ts:11 ~ recover ~ uuid:", uuid)
      uuid.current = param.uuid;
      let msgQueue = param.msgQueue || [];
      console.log("file: recover.ts:11 ~ recover ~ msgQueue:", msgQueue)
      if (param.reconnect) {
        msgQueue = msgQueue.map((item) => {
          return {
            ...item,
            msgDetail: {
              ...item.msgDetail,
              reconnect: true,
            },
          };
        });
      }
      if (msgQueue.length === 0) {
        handleSendMessage({
          type: CoursewareEvent.RecoverCWStateResult,
          param: { uuid: param.uuid, result: "success" },
          timestamp: new Date().getTime(),
        });
        return;
      } else {
        console.log("file: recover.ts:9 ~ useRecoverController ~ msgControllerList:", msgControllerList)

        signalling
        .recover(msgQueue)
        .then(() => {
          const arr = msgQueue.map((item) => item.msgDetail) || [];
          console.log("file: main.tsx:191 ~ .then ~ arr:", arr);
          handleSendMessage({
            type: CoursewareEvent.CWStateChange,
            param: {},
            timestamp: new Date().getTime(),
          });
          handleSendMessage({
            type: CoursewareEvent.RecoverCWStateResult,
            param: { uuid: uuid.current, result: "success" },
            timestamp: new Date().getTime(),
          });
        })
        .catch((err) => {
          handleSendMessage({
            type: CoursewareEvent.RecoverCWStateResult,
            param: { uuid: uuid.current, result: "error" },
            timestamp: new Date().getTime(),
          });
        });
      }
    };
  }
  return [recover];
};
