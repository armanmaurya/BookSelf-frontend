"use client";
import { WSGIEditor } from "@bookself/slate-editor/editor";
import { Article } from "@/app/types";
import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import { API_ENDPOINT } from "@/app/utils";
import { Store } from "react-notifications-component";
import { PreviewButton } from "@/components/element/button/PreviewButton";

export const RichTextEditor = ({
  initialValue,
  id: slug,
  title
}: {
  id: string;
  initialValue: string;
  title: string;
}) => {
  return (
    <div>
      {/* <WSGIEditor initialValue={initialValue} title={title} /> */}
    </div>
  );
};
