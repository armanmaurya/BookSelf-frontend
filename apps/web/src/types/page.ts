export interface Page {
    id: number;
    title: string;
    slug: string;
    path: string;
    hasChildren: boolean;
    children?: Page[];
    content: string;
}