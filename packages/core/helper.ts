export function drawShapes(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const shapeWidth = width / 5;
  const centerY = height / 2;

  // Star
  drawStar(ctx, shapeWidth * 0.5, centerY, shapeWidth * 0.4);

  // Triangle
  drawTriangle(ctx, shapeWidth * 1.5, centerY, shapeWidth * 0.4);

  // Rectangle
  drawRectangle(
    ctx,
    shapeWidth * 2.5,
    centerY,
    shapeWidth * 0.5,
    shapeWidth * 0.3,
  );

  // Square
  drawSquare(ctx, shapeWidth * 3.5, centerY, shapeWidth * 0.35);

  // Circle
  drawCircle(ctx, shapeWidth * 4.5, centerY, shapeWidth * 0.2);

  return canvas;
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
): void {
  const spikes = 5;
  const outerRadius = radius;
  const innerRadius = radius / 2;
  let rotation = (Math.PI / 2) * 3;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(x, y - outerRadius);

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(
      x + Math.cos(rotation) * outerRadius,
      y + Math.sin(rotation) * outerRadius,
    );
    rotation += step;
    ctx.lineTo(
      x + Math.cos(rotation) * innerRadius,
      y + Math.sin(rotation) * innerRadius,
    );
    rotation += step;
  }

  ctx.lineTo(x, y - outerRadius);
  ctx.closePath();
  ctx.fillStyle = "gold";
  ctx.fill();
  ctx.strokeStyle = "orange";
  ctx.stroke();
}

function drawTriangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x, y - size);
  ctx.lineTo(x + size, y + size);
  ctx.lineTo(x - size, y + size);
  ctx.closePath();
  ctx.fillStyle = "blue";
  ctx.fill();
  ctx.strokeStyle = "darkblue";
  ctx.stroke();
}

function drawRectangle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  ctx.fillStyle = "green";
  ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = "darkgreen";
  ctx.strokeRect(x - w / 2, y - h / 2, w, h);
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.fillStyle = "red";
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  ctx.strokeStyle = "darkred";
  ctx.strokeRect(x - size / 2, y - size / 2, size, size);
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "purple";
  ctx.fill();
  ctx.strokeStyle = "indigo";
  ctx.stroke();
}

export async function canvasToBlobUrl(
  canvas: HTMLCanvasElement,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    });
  });
}
