export type ImageElementType = {
    type: "image" | null;
    align: "left" | "center" | "right";
    width: number;
    url: string | null;
    children: CustomText[];
  };