// True only on devices with a precise pointer (mouse/trackpad). Use it to gate
// `autoFocus` on inputs: auto-focusing on a touch device pops the on-screen
// keyboard, which resizes the visual viewport and makes the page jump/scroll the
// moment a field or dropdown appears. Touch users tap the field when they want
// to type. SSR-safe — returns false on the server (where there is no keyboard).
export function isFinePointer(): boolean {
  return typeof window !== "undefined" && !!window.matchMedia?.("(pointer: fine)")?.matches;
}
