"use client";

import { TextareaHTMLAttributes, useEffect, useLayoutEffect, useRef } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

// useLayoutEffect on the client, useEffect during SSR.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function AutoTextarea({ minRows = 2, value, style, rows, ...rest }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={rows ?? minRows}
      style={{ overflow: "hidden", resize: "none", ...style }}
      {...rest}
    />
  );
}
