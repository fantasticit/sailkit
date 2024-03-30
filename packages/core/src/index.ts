export * from "./pm";
export * from "@tiptap/core";
export function isAndroid(): boolean {
  return navigator.platform === "Android" || /android/i.test(navigator.userAgent);
}
