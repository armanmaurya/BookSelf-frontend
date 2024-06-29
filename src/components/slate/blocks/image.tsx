import { RenderElementProps } from "slate-react";

export const Image = (props: RenderElementProps) => {
    const { attributes, children, element } = props;
    let imgUrl = "";
    if (element.type === "image") {
      imgUrl = element.url as string;
    }
    console.log("Runnded");
    return (
      <div {...attributes}>
        {imgUrl === "" ? (
          <div
            contentEditable={false}
            className="w-full h-12 bg-slate-200 flex items-center p-3"
          >
            <img
              src="https://img.icons8.com/?size=100&id=53386&format=png&color=000000"
              className="h-10"
              alt=""
            />
          </div>
        ) : (
          <div>
            <div contentEditable={false}>
              <img
                src={element.type === "image" ? (element.url as string) : ""}
                alt="Invalid Image URL"
                className={`w-full rounded-lg`}
              />
            </div>
            <div className="w-full text-center text-sm">{children}</div>
          </div>
        )}
      </div>
    );
  };