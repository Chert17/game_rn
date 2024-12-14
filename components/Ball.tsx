import { useWindowDimensions } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';

import { ballSpeed, boardHeight } from '~/constants';
import { useGameContext } from '~/providers/GameContext';

export const Ball = () => {
  const { width } = useWindowDimensions();
  const { ball, isUserTurn, onEndTurn } = useGameContext();

  const frameCallback = useFrameCallback((frameInfo) => {
    const delta = (frameInfo.timeSincePreviousFrame || 0) / 1000;
    let { x, y, r, dx, dy } = ball!.value;

    x = x + dx * ballSpeed * delta;
    y = y + dy * ballSpeed * delta;

    // touched top wall
    if (y < r) {
      dy *= -1;
      y = r;
    }

    // touched bottom wall
    if (y > boardHeight - r) {
      // dy *= -1;
      y = boardHeight - r;
      onEndTurn();
    }

    // touched left wall
    if (x < r) {
      dx *= -1;
      x = r;
    }

    // touched right wall
    if (x > width - r) {
      dx *= -1;
      x = width - r;
    }

    ball!.value = { r, x, y, dx, dy };
  }, false);

  const startFrameCallback = (val: boolean) => {
    frameCallback.setActive(val);
  };

  useAnimatedReaction(
    () => isUserTurn!.value,
    (val) => runOnJS(startFrameCallback)(!val)
  );

  const ballStyle = useAnimatedStyle(() => {
    const { x, y, r } = ball!.value;
    return {
      width: r * 2,
      aspectRatio: 1,
      borderRadius: r * 2,
      backgroundColor: 'white',
      position: 'absolute',
      top: y - r,
      left: x - r,
    };
  });

  return <Animated.View style={ballStyle} />;
};
