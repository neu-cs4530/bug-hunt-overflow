import './index.css';
import { GameStatus } from '../../../../types/types';

interface GameStatusBadgeProps {
  status: GameStatus;
}

const GameStatusBadge = (props: GameStatusBadgeProps) => {
  const { status } = props;

  if (!status) return <></>;

  switch (status) {
    case 'IN_PROGRESS':
      return <p className='game-status in-progress'>In Progress</p>;
    case 'WAITING_TO_START':
      return <p className='game-status waiting'>Waiting to Start</p>;
    case 'OVER':
      return <p className='game-status over'>Game Over</p>;
    case 'DAILY':
      return <p className='game-status daily'>Daily Game</p>;
    default:
      return <></>;
  }
};

export default GameStatusBadge;
