import { Article } from '@/app/types';
import { API_ENDPOINT } from '@/app/utils';
import { NotebookOverview, NotebookOverviewProps } from '@/components/blocks/NotebookOverview';

const Page = async ({
    params,
}: {
    params: Promise<{ username: string; notebook: string }>;
}) => {
    const { username, notebook } = await params;

    const res = await fetch(`${API_ENDPOINT.notebook.url}/${username}/${notebook}`, );
    const data: NotebookOverviewProps = await res.json();
    return (
        <NotebookOverview data={data} />
    )
}

export default Page;