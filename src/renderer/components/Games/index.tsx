import clsx from 'clsx';
import GAMES from 'constants/games';
import { useState } from 'react';

const Games = ({ onChange, value }: IProps) => {
  const [selectedGame, setSelectedGame] = useState<number>(value);
  const isSelected = (i: number) => i === selectedGame;
  return (
    <div className="grid grid-cols-2 gap-8 my-7">
      {GAMES.map((game, i) => {
        return (
          // eslint-disable-next-line
          <div
            className={clsx(
              'flex  px-4 py-2 transition-all select-none rounded-md cursor-pointer border space-x-5 items-center bg-secondary',
              isSelected(i) ? 'border-primary' : 'border-secondary'
            )}
            onClick={() => {
              onChange(i);
              setSelectedGame(i);
            }}
            key={game.name}
          >
            <img className="w-9" src={game.icon} alt={`${game.name}-logo`} />
            <h1 className="text-lightText">{game.name}</h1>
            {isSelected(i) && (
              <div
                className="h-3 w-3 bg-primary  rounded-full"
                style={{ margin: 0, marginLeft: 'auto' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface IProps {
  onChange: (game: number) => void;
  value: number;
}
export default Games;
