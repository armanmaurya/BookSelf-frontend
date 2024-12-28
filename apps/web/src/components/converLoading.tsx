import { Oval } from "react-loader-spinner";

export const ConverLoading = () => {
    return (
        <div className="absolute h-screen w-screen bg-neutral-500 bg-opacity-20 left-0 top-0 z-50">
            <div className="flex justify-center items-center h-full">
                <Oval secondaryColor="#000" color="#383838" height={100} width={100} />
            </div>
        </div>
    );
}