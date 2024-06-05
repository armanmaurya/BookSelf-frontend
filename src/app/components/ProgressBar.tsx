'use client'
import React, { useState } from "react";
import { ThreeCircles } from "react-loader-spinner";

const ProgressBar = () => {
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(false);
  return (
    <>
      {isProgressBarVisible && (
        <div className="flex items-center justify-center absolute bg-zinc-300 bg-opacity-20 h-full w-full">
          <ThreeCircles color="#000" height={50} width={50} />
        </div>
      )}
    </>
  );
};

export default ProgressBar;
