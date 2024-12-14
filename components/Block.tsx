import { useState } from 'react';
import { Text } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useGameContext } from '~/providers/GameContext';

export const Block = ({ index }: { index: number }) => {
  const { blocks } = useGameContext();
  const [value, setValue] = useState(blocks?.value[index].val || 0);

  useAnimatedReaction(
    () => blocks?.value[index]?.val,
    (val) => {
      if (val !== undefined) {
        runOnJS(setValue)(val);
      }
    }
  );

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

      alignItems: 'center',
      justifyContent: 'center',
    };
  });

  return (
    <Animated.View style={style}>
      <Text style={{ fontWeight: 'bold', color: 'white', fontSize: 16 }}>{value}</Text>
    </Animated.View>
  );
};
