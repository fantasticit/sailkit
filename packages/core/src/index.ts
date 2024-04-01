export * from "./pm";
export type * from "@tiptap/core";
export * from "@tiptap/core";
export function isAndroid(): boolean {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
