"use client";

import { useLoading } from "../context/LoadingContext";
import { Oval, OvalProps } from "react-loader-spinner";

interface OvalSpinnerProps extends OvalProps {
  className?: string;
}

export const OvalSpinner = (props: OvalSpinnerProps) => {
  const { isLoading } = useLoading();

  const { className, ...restProps } = props;

  return (
    <>
      {isLoading && (
        <div className={`${className}`}>
          <Oval {...restProps} />
        </div>
      )}
    </>
  );
};
