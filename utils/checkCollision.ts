import { BallData, BlockData } from '~/types';

// Function to check if the ball is colliding with the block
export const checkCollision = (ball: BallData, block: BlockData): boolean => {
  'worklet';
  // Calculate block boundaries
  const blockRight = block.x + block.w;
  const blockBottom = block.y + block.w;

  // Find the closest point to the ball within the block
  const closestX = Math.max(block.x, Math.min(ball.x, blockRight));
  const closestY = Math.max(block.y, Math.min(ball.y, blockBottom));

  // Calculate the distance from the ball's center to the closest point
  const distanceX = ball.x - closestX;
  const distanceY = ball.y - closestY;
  const distanceSquared = distanceX * distanceX + distanceY * distanceY;

  // Return true if the distance is less than the ball's radius
  return distanceSquared < ball.r * ball.r;
};
