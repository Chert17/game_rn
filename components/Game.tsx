import { FC } from 'react';
import { Button, SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Ball } from './Ball';
import { Block } from './Block';

import { ballRadius, boardHeight } from '~/constants';
import { GameContext } from '~/providers/GameContext';
import { BallData } from '~/types';
import { generateBlocksRow } from '~/utils/generateBlocksRow';

export const Game: FC = () => {
  const { width } = useWindowDimensions();

  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  const isUserTurn = useSharedValue(true);

  const onEndTurn = () => {
    'worklet'; // work with only animation object
    if (isUserTurn.value) return;

    isUserTurn.value = true;
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (!isUserTurn.value) return;

      const x = e.translationX;
      const y = e.translationY;

      const mag = Math.sqrt(x * x + y * y);

      ball.value = {
        ...ball.value,
        dx: -x / mag,
        dy: -y / mag,
      };
    })
    .onEnd(() => {
      if (ball.value.dy < 0) {
        isUserTurn.value = false;
      }
    });

  const pathStyle = useAnimatedStyle(() => {
    const { x, y, dx, dy } = ball!.value;

    const angle = Math.atan2(-dx, dy);

    return {
      display: isUserTurn!.value && dy < 0 ? 'flex' : 'none',
      top: y,
      left: x,
      transform: [{ rotate: `${angle}rad` }],
    };
  });

  const blocks = useSharedValue(
    Array(3)
      .fill(0)
      .flatMap((_, row) => generateBlocksRow(row + 1))
  );

  return (
    <GameContext.Provider value={{ ball, isUserTurn, onEndTurn, blocks }}>
      <GestureDetector gesture={pan}>
        <SafeAreaView style={styles.container}>
          <View style={styles.board}>
            {blocks!.value.map((_, index) => (
              <Block key={index} index={index} />
            ))}

            <Ball />

            <Animated.View style={[styles.ballTrajectory, pathStyle]} />
          </View>
          <Button title="Launch" onPress={() => (isUserTurn.value = false)} />
        </SafeAreaView>
      </GestureDetector>
    </GameContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
  },
  board: {
    backgroundColor: '#202020',
    height: boardHeight,
    marginVertical: 'auto',
    overflow: 'hidden',
  },
  ballTrajectory: {
    width: 0,
    height: 1000,
    position: 'absolute',
    borderRadius: 30,
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: '#ffffff99',
    transformOrigin: 'top-center',
  },
});
