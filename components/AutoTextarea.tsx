"use client";

import { TextareaHTMLAttributes, useEffect, useLayoutEffect, useRef, useState } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  minRows?: number;
}

// useLayoutEffect on the client, useEffect during SSR.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export default function AutoTextarea({ minRows = 2, value, style, rows, className = "", ...rest }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);
  // On mobile keep every value on a single line: it saves space and, crucially,
  // the field never changes height while typing, so the form layout doesn't
  // jump/wobble. On larger screens the field auto-grows so long content is fully visible.
  const [singleLine, setSingleLine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setSingleLine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (singleLine) {
      el.style.height = ""; // let rows=1 control height — fixed, no growth
      return;
    }
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [value, singleLine]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={singleLine ? 1 : (rows ?? minRows)}
      // Values sit a touch lighter than the bold dark field labels.
      className={`text-gray-700 ${className}`}
      // appearance:none removes the browser's native textarea chrome (faint dotted
      // border + resize grip). On mobile: nowrap + horizontal scroll = a stable
      // single line; on desktop: wrap + auto-grow.
      style={{
        overflowY: "hidden",
        overflowX: singleLine ? "auto" : "hidden",
        whiteSpace: singleLine ? "nowrap" : "normal",
        resize: "none",
        appearance: "none",
        WebkitAppearance: "none",
        borderStyle: "dashed",
        ...style,
      }}
      {...rest}
    />
  );
}
