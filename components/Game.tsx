import { FC } from 'react';
import { SafeAreaView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

import { Ball } from './Ball';

import { ballRadius, boardHeight } from '~/constants';
import { GameProvider } from '~/providers/GameContext';
import { BallData } from '~/types';

export const Game: FC = () => {
  const { width } = useWindowDimensions();

  const ball = useSharedValue<BallData>({
    x: width / 2,
    y: boardHeight - ballRadius,
    r: ballRadius,
    dx: -1,
    dy: -1,
  });

  return (
    <GameProvider ball={ball}>
      <SafeAreaView style={styles.container}>
        <View style={styles.board}>
          <Ball />
        </View>
      </SafeAreaView>
    </GameProvider>
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
});
