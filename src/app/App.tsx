import { FC } from 'react';
import ShakeComponent from '../components/Shake';

const ShakeGame: FC = () => {

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className="text-red-800">Shake Game</h1>
      <ShakeComponent/>
      <h3>25 V.4.3</h3>
    </div>
  );
};

export default ShakeGame;



