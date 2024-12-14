import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { useGameContext } from '~/providers/GameContext';

export const Block = ({ index }: { index: number }) => {
  const { blocks } = useGameContext();

  const style = useAnimatedStyle(() => {
    const block = blocks!.value[index];

    if (!block || block.val <= 0) {
      return { display: 'none' };
    }

    return {
      width: block.w,
      height: block.w,
      left: block.x,
      top: withTiming(block.y),
      display: 'flex',
      backgroundColor: '#F5B52F',
      position: 'absolute',
    };
  });

  return <Animated.View style={style} />;
};
