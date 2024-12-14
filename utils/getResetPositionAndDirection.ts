import { checkCollision } from './checkCollision';

import { BallData, BlockData } from '~/types';

export const getResetPositionAndDirection = (ball: BallData, block: BlockData): BallData | null => {
  'worklet';
  // Only calculate if there's a collision
  if (!checkCollision(ball, block)) return null;

  // Calculate block boundaries
  const blockRight = block.x + block.w;
  const blockBottom = block.y + block.w;

  let newDx = ball.dx;
  let newDy = ball.dy;
  const r = ball.r;

  // Determine the side of collision and reset the ball's position and direction
  if (Math.abs(ball.y - block.y) < ball.r && ball.dy > 0) {
    // Top side collision
    newDy = -ball.dy; // Reverse vertical direction
    return { x: ball.x, y: block.y - ball.r, dx: newDx, dy: newDy, r };
  } else if (Math.abs(ball.y - blockBottom) < ball.r && ball.dy < 0) {
    // Bottom side collision
    newDy = -ball.dy; // Reverse vertical direction
    return { x: ball.x, y: blockBottom + ball.r, dx: newDx, dy: newDy, r };
  } else if (Math.abs(ball.x - block.x) < ball.r && ball.dx > 0) {
    // Left side collision
    newDx = -ball.dx; // Reverse horizontal direction
    return { x: block.x - ball.r, y: ball.y, dx: newDx, dy: newDy, r };
  } else if (Math.abs(ball.x - blockRight) < ball.r && ball.dx < 0) {
    // Right side collision
    newDx = -ball.dx; // Reverse horizontal direction
    return { x: blockRight + ball.r, y: ball.y, dx: newDx, dy: newDy, r };
  }

  // In case of a collision but no clear side is detected
  return null;
};
