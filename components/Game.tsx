import { FC } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { boardHeight } from '~/constants';

export const Game: FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.board}>{/* TODO: Add game elements */}</View>
    </SafeAreaView>
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
