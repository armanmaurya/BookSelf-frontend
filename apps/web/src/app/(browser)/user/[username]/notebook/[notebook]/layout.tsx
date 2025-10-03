import {
  ReactPanelResizeHandler,
  ReactPanel,
  ReactPanelGroup,
} from "@/components/element/panels";
import { MenuProvider } from "@bookself/context-menu";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>;
};

export default layout;
