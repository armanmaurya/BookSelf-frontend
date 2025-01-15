import { ReactPanelResizeHandler, ReactPanel, ReactPanelGroup } from "@/components/element/panels";
import { RenderNavTree } from "@/components/navTree/EditNavTree";
import { MenuProvider } from "@bookself/context-menu";

const layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <ReactPanelGroup direction="horizontal">
            <ReactPanel defaultSize={20} minSize={15}>
                <MenuProvider>
                    <RenderNavTree />
                </MenuProvider>
            </ReactPanel>
            <ReactPanelResizeHandler className="bg-white" style={{ width: "1px" }} />
            <ReactPanel className="p-2" defaultSize={80}>
                {children}
            </ReactPanel>
        </ReactPanelGroup>
    );
};

export default layout;

