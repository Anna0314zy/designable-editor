import { createContext, PropsWithChildren } from "react";

export interface SlideInfoContextIF {
  pageList: any[];
  activeId: string;
  nextId: string;
}

interface Size {
  wrapperHeight: number;
  wrapperWidth: number;
  scale: number;
  clientHeight: number;
  clientWidth: number;
}

export const GlobalPropContext = createContext({});
export const SlideInfoContext = createContext<PropsWithChildren<any>>(
  null as unknown as PropsWithChildren<SlideInfoContextIF>
);

export const SizeContext = createContext<PropsWithChildren<Size>>(
  null as unknown as PropsWithChildren<Size>
);
