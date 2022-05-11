import { Game } from 'types/game';
import LolLogo from '../../assets/icons/lol.png';
import Valorant from '../../assets/icons/valorant.png';

const GAMES: {
  name: string;
  icon: string;
  key: Game;
  supportsAutoFill: boolean;
}[] = [
  {
    name: 'League of legends',
    key: 'lol',
    icon: LolLogo,
    supportsAutoFill: true,
  },
  {
    name: 'Other games',
    key: 'otc',
    icon: Valorant,
    supportsAutoFill: false,
  },
];

export default GAMES;
