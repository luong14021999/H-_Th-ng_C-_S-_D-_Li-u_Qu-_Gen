"use client";

import { TextareaHTMLAttributes, useEffect, useLayoutEffect, useRef } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

// useLayoutEffect on the client, useEffect during SSR.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function AutoTextarea({ minRows = 2, value, style, rows, className = "", ...rest }: Props) {
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
      // Values sit a touch lighter than the bold dark field labels.
      className={`text-gray-700 ${className}`}
      // appearance:none removes the browser's native textarea chrome (the faint
      // dotted/beveled border + resize grip) that otherwise shows through on an
      // underline-only field; border-style stays solid so border-b renders clean.
      style={{ overflow: "hidden", resize: "none", appearance: "none", WebkitAppearance: "none", borderStyle: "dashed", ...style }}
      {...rest}
    />
  );
}
