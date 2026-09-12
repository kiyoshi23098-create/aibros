export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export async function compressImage(file, { maxDimension = 1280, quality = 0.72 } = {}) {
  const rawDataUrl = await readFileAsDataUrl(file);
  const img = await loadImage(rawDataUrl);

  let { width, height } = img;
  if (width > maxDimension || height > maxDimension) {
    const scale = maxDimension / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', quality);
}

export function splitDataUrl(dataUrl) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return { mimeType: 'application/octet-stream', data: '' };
  return { mimeType: match[1], data: match[2] };
  }
