"use client";

import { useLoading } from "../context/LoadingContext";
import { TriangleProps, Triangle } from "react-loader-spinner";

interface TriangleSpinnerProps extends TriangleProps {
  className?: string;
}

export const TriangleSpinner = (props: TriangleSpinnerProps) => {
  const { isLoading } = useLoading();

  const { className, ...restProps } = props;

  return (
    <>
      {isLoading && (
        <div className={`${className}`}>
          <Triangle
            {...restProps}
            color="grey"
          />
        </div>
      )}
    </>
  );
};
