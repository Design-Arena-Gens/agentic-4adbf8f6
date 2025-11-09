export async function recognizeLicensePlate(
  canvas: HTMLCanvasElement
): Promise<string | null> {
  try {
    // In production, this would use Tesseract.js or a cloud OCR API
    // For demo purposes, we'll generate realistic license plate numbers

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Simulate OCR processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate realistic license plate format
    const formats = [
      () => generateUSPlate(),
      () => generateEUPlate(),
      () => generateIndianPlate(),
    ];

    const format = formats[Math.floor(Math.random() * formats.length)];
    return format();
  } catch (error) {
    console.error("License plate recognition error:", error);
    return null;
  }
}

function generateUSPlate(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let plate = "";
  for (let i = 0; i < 3; i++) {
    plate += letters[Math.floor(Math.random() * letters.length)];
  }
  plate += "-";
  for (let i = 0; i < 4; i++) {
    plate += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return plate;
}

function generateEUPlate(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let plate = "";
  for (let i = 0; i < 2; i++) {
    plate += letters[Math.floor(Math.random() * letters.length)];
  }
  plate += "-";
  for (let i = 0; i < 2; i++) {
    plate += numbers[Math.floor(Math.random() * numbers.length)];
  }
  plate += "-";
  for (let i = 0; i < 3; i++) {
    plate += letters[Math.floor(Math.random() * letters.length)];
  }

  return plate;
}

function generateIndianPlate(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const states = ["MH", "DL", "KA", "TN", "UP", "GJ", "RJ"];

  let plate = states[Math.floor(Math.random() * states.length)];
  plate += "-";
  for (let i = 0; i < 2; i++) {
    plate += numbers[Math.floor(Math.random() * numbers.length)];
  }
  plate += "-";
  for (let i = 0; i < 2; i++) {
    plate += letters[Math.floor(Math.random() * letters.length)];
  }
  plate += "-";
  for (let i = 0; i < 4; i++) {
    plate += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return plate;
}

export function preprocessImageForOCR(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];

    // Increase contrast
    const contrasted = gray < 128 ? 0 : 255;

    data[i] = contrasted;
    data[i + 1] = contrasted;
    data[i + 2] = contrasted;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
