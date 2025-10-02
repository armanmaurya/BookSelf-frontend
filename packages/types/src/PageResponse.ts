export interface PageResponse {
    id: number;
    title: string;
    content: any;
    created_at: string;
    updated_at: string;
    notebook: number;
    parent: number | null;
    index: number;
    has_children: boolean;
    slug: string;
    children?: PageResponse[];
}