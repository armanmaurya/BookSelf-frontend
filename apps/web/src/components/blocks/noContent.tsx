"use client";
import lottieData from "@/assets/lottie/noContent.json";
import Lottie from 'react-lottie-player'

export const NoContent = () => {
    return (
        <div>
            <Lottie animationData={lottieData} loop play style={{ height: 600 }} />
        </div>
    )
}
