import { Game } from 'types/game';

const useGame = (game: Game) => {
  const data = localStorage.getItem(game);
  return data ? JSON.parse(data) : [];
};
export default useGame;
