import { Article } from "@/app/types";
import { RichTextEditor } from "./RichTextEditor"
import { WSGIEditor } from "@bookself/slate-editor";

export type NotebookOverviewProps = {
    id: string;
    name: string;
    slug: string;
    overview: string;
}

export const NotebookOverview = ({
    data
}: {
    data: NotebookOverviewProps;
}) => {
    return (
        <div>
            {/* <RichTextEditor title={data.name} initialValue={data.overview} id="" /> */}
            <WSGIEditor initialValue={data.overview} title={data.name}/>
        </div>
    )
}
