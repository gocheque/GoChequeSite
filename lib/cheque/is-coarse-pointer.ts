/** Touch / mobile — forcer le flux d'impression in-page (iframe.print est cassé sur iOS). */
export function isCoarsePointerDevice(): boolean {
  if (typeof window === "undefined") return false;

  const coarsePrimary = window.matchMedia("(pointer: coarse)").matches;
  const anyCoarse = window.matchMedia("(any-pointer: coarse)").matches;
  const ua = navigator.userAgent || "";
  const iOS =
    /iPad|iPhone|iPod/i.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);

  return coarsePrimary || anyCoarse || iOS || android;
}
