import { memo } from 'react';
import { Coffee } from '../../types/coffee';
import styles from './CoffeeCard.module.css';

interface CoffeeCardProps {
  coffee: Coffee;
  onClick: (id: number) => void;
}

function CoffeeCard({ coffee, onClick }: CoffeeCardProps) {
  return (
    <div 
      className={styles.card}
      onClick={() => onClick(coffee.id)}
    >
      <h2 className={styles.title}>☕{coffee.title}</h2>
      <p className={styles.category}>{coffee.category}</p>
    </div>
  );
}

export default memo(CoffeeCard);