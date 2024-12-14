import { createContext, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

import { BallData } from '~/types';

type ContextProps = {
  ball?: SharedValue<BallData>;
  isUserTurn?: SharedValue<boolean>;
  onEndTurn: () => void;
};

export const GameContext = createContext<ContextProps>({
  onEndTurn: () => {},
});

export const useGameContext = () => useContext(GameContext);
