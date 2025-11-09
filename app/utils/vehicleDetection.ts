export function detectVehicles(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return false;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Simple vehicle detection based on image analysis
  // In production, this would use a trained ML model like YOLO or TensorFlow

  let darkPixels = 0;
  let totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;

    if (brightness < 100) {
      darkPixels++;
    }
  }

  // Detect edges and contrast patterns typical of vehicles
  const edgeScore = detectEdges(imageData);
  const vehicleLikelihood = (darkPixels / totalPixels) * edgeScore;

  // Simulate detection with some randomness for demo purposes
  // In production, this would be replaced with actual ML model inference
  return vehicleLikelihood > 0.15 || Math.random() > 0.7;
}

function detectEdges(imageData: ImageData): number {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  let edgeCount = 0;

  // Simple Sobel edge detection
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const topIdx = ((y - 1) * width + x) * 4;
      const bottomIdx = ((y + 1) * width + x) * 4;
      const leftIdx = (y * width + (x - 1)) * 4;
      const rightIdx = (y * width + (x + 1)) * 4;

      const gx = Math.abs(data[rightIdx] - data[leftIdx]);
      const gy = Math.abs(data[bottomIdx] - data[topIdx]);
      const gradient = Math.sqrt(gx * gx + gy * gy);

      if (gradient > 50) {
        edgeCount++;
      }
    }
  }

  return edgeCount / (width * height);
}
