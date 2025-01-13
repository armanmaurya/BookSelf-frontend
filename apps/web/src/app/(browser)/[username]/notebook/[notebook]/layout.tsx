import { ReactPanelResizeHandler, ReactPanel, ReactPanelGroup } from "@/components/element/panels";
import { ReadNavTree } from "@/components/navTree/ReadNavTree";

const layout = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <ReactPanelGroup direction="horizontal">
            <ReactPanel defaultSize={30} minSize={15}>
                <ReadNavTree />
            </ReactPanel>
            <ReactPanelResizeHandler className="bg-white" style={{ width: "1px" }} />
            <ReactPanel defaultSize={70}>
                {children}
            </ReactPanel>
        </ReactPanelGroup>
    );
};

export default layout;

