"use client";
import lottieData from "@/assets/lottie/noContent.json";
import Lottie from 'react-lottie-player'

export const NoContent = ({
    height = 500
}: {
    height?: number
}) => {
    ;
    return (
        <div>
            <Lottie animationData={lottieData} loop play style={{ height: height }} />
        </div>
    )
}
