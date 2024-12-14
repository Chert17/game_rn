import { FC, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { Ball } from './Ball';
import { Block } from './Block';

import { ballRadius, blockW, boardHeight } from '~/constants';
import { GameContext } from '~/providers/GameContext';
import { BallData, BlockData } from '~/types';
import { generateBlocksRow } from '~/utils/generateBlocksRow';

export const Game: FC = () => {
  const { width } = useWindowDimensions();
  const [score, setScore] = useState(1);

  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  const blocks = useSharedValue<BlockData[]>(
    Array(3)
      .fill(0)
      .flatMap((_, row) => generateBlocksRow(row + 1))
  );

  const isUserTurn = useSharedValue(true);

  const incrementScore = () => {
    setScore((s) => s + 1);
  };

  const onGameOver = () => {
    Alert.alert('Game over', 'Score: ' + score, [
      {
        text: 'Restart',
        onPress: () => {
          blocks.value = [];

          blocks.value = Array(3)
            .fill(0)
            .flatMap((_, row) => generateBlocksRow(row + 1));

          setScore(1);
        },
      },
    ]);
  };

  const onEndTurn = () => {
    'worklet';
    if (isUserTurn.value) {
      return;
    }
    isUserTurn.value = true;

    // check if game is over
    const gameOver = blocks.value.some(
      (block) => block.val > 0 && block.y + 2 * (blockW + 10) > boardHeight
    );
    if (gameOver) {
      console.log('game over');
      runOnJS(onGameOver)();
      return;
    }

    blocks.modify((blocks) => {
      blocks.forEach((block) => {
        block.y += blockW + 10;
      });

      blocks.push(...generateBlocksRow(1));

      return blocks;
    });

    runOnJS(incrementScore)();
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (!isUserTurn.value) {
        return;
      }

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
    const { x, y, dx, dy } = ball.value;
    const angle = Math.atan2(-dx, dy);

    return {
      display: isUserTurn.value ? 'flex' : 'none',
      top: y,
      left: x,
      transform: [
        {
          rotate: `${angle}rad`,
        },
      ],
    };
  });

  return (
    <GameContext.Provider value={{ ball, isUserTurn, onEndTurn, blocks }}>
      <GestureDetector gesture={pan}>
        <SafeAreaView style={styles.container}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'gray' }}>{score}</Text>
          </View>

          <View style={styles.board}>
            {blocks.value.map((_, index) => (
              <Block key={index} index={index} />
            ))}

            <Ball />

            <Animated.View style={[styles.ballTrajectory, pathStyle]} />
          </View>
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
