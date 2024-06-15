import RNotification from "../components/RNotification";
import { MarkdownEditor, WSGIEditor } from "../components/slate/editor";

export default function Editor() {
  return (
    // <MarkdownEditor/>
    <div>
      <RNotification />
      <WSGIEditor />
    </div>
    // <MarkdownPreviewExample/>
  );
}
