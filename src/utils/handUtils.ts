interface Landmark {
  x: number;
  y: number;
  z: number;
}

/**
 * Draws hand landmarks on a canvas
 */
export function drawHand(ctx: CanvasRenderingContext2D, landmarks: Landmark[]): void {
  // Draw each landmark point
  for (let i = 0; i < landmarks.length; i++) {
    const { x, y } = landmarks[i];
    
    // Convert normalized coordinates to canvas coordinates
    const canvasX = x * ctx.canvas.width;
    const canvasY = y * ctx.canvas.height;
    
    // Draw landmark point
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#3B82F6';
    ctx.fill();
    
    // Add landmark index
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.fillText(`${i}`, canvasX + 10, canvasY + 5);
  }
  
  // Connect landmarks with lines to form the hand skeleton
  // Thumb
  connectLandmarks(ctx, landmarks, [0, 1, 2, 3, 4]);
  
  // Index finger
  connectLandmarks(ctx, landmarks, [0, 5, 6, 7, 8]);
  
  // Middle finger
  connectLandmarks(ctx, landmarks, [0, 9, 10, 11, 12]);
  
  // Ring finger
  connectLandmarks(ctx, landmarks, [0, 13, 14, 15, 16]);
  
  // Pinky
  connectLandmarks(ctx, landmarks, [0, 17, 18, 19, 20]);
  
  // Palm
  connectLandmarks(ctx, landmarks, [0, 5, 9, 13, 17]);
}

/**
 * Connect landmarks with lines
 */
function connectLandmarks(
  ctx: CanvasRenderingContext2D, 
  landmarks: Landmark[], 
  indices: number[]
): void {
  if (!landmarks.length) return;
  
  ctx.beginPath();
  
  for (let i = 0; i < indices.length; i++) {
    const { x, y } = landmarks[indices[i]];
    const canvasX = x * ctx.canvas.width;
    const canvasY = y * ctx.canvas.height;
    
    if (i === 0) {
      ctx.moveTo(canvasX, canvasY);
    } else {
      ctx.lineTo(canvasX, canvasY);
    }
  }
  
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 2;
  ctx.stroke();
}