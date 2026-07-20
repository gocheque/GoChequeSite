function absolutizeImageSrc(img: HTMLImageElement) {
  const src = img.getAttribute("src");
  if (!src || src.startsWith("data:") || src.startsWith("http")) return;

  try {
    img.src = new URL(src, window.location.origin).href;
  } catch {
    // keep original src
  }
}

async function inlineImageAsDataUrl(img: HTMLImageElement): Promise<void> {
  const raw = img.currentSrc || img.src;
  if (!raw || raw.startsWith("data:")) return;

  try {
    const absolute = new URL(raw, window.location.origin).href;
    const response = await fetch(absolute);
    if (!response.ok) return;

    const blob = await response.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });

    img.src = dataUrl;
  } catch {
    absolutizeImageSrc(img);
  }
}

function waitForImageElement(img: HTMLImageElement): Promise<void> {
  if (img.complete && img.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    img.addEventListener("load", () => resolve(), { once: true });
    img.addEventListener("error", () => resolve(), { once: true });
  });
}

/** Assure que les images du clone d'impression sont embarquées et chargées. */
export async function preparePrintImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));

  await Promise.all(
    images.map(async (img) => {
      absolutizeImageSrc(img);
      await inlineImageAsDataUrl(img);
      await waitForImageElement(img);
    }),
  );
}

export async function waitForPrintFonts(win: Window = window): Promise<void> {
  if (!win.document.fonts) return;

  await Promise.race([
    win.document.fonts.ready.catch(() => undefined),
    new Promise<void>((resolve) => {
      win.setTimeout(resolve, 1500);
    }),
  ]);
}

export async function waitForPrintAssets(
  root: HTMLElement,
  win: Window = window,
): Promise<void> {
  await preparePrintImages(root);
  await waitForPrintFonts(win);

  await new Promise<void>((resolve) => {
    win.requestAnimationFrame(() => resolve());
  });
}
