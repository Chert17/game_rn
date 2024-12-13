import { createContext, FC, PropsWithChildren, useContext } from 'react';
import { SharedValue } from 'react-native-reanimated';

import { BallData } from '~/types';

export const GameContext = createContext<{
  ball?: SharedValue<BallData>;
}>({});

export const useGameContext = () => useContext(GameContext);

export const GameProvider: FC<PropsWithChildren & { ball?: SharedValue<BallData> }> = ({
  children,
  ball,
}) => {
  return <GameContext.Provider value={{ ball }}>{children}</GameContext.Provider>;
};
