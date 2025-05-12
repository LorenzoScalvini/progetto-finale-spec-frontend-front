import { memo, useMemo } from 'react';
import { Coffee } from '../../types/coffee';

interface CoffeeCardProps {
  coffee: Coffee;
  onClick: (id: number) => void;
}

function CoffeeCard({ coffee, onClick }: CoffeeCardProps) {
  // Formatta la data in un formato più leggibile
  const formattedDate = useMemo(() => {
    if (!coffee.updatedAt) return '';
    return new Date(coffee.updatedAt).toLocaleDateString();
  }, [coffee.updatedAt]);

  return (
    <div 
      className="p-4 border rounded-md cursor-pointer hover:bg-gray-100"
      onClick={() => onClick(coffee.id)}
    >
      <h2 className="text-lg font-bold">{coffee.title}</h2>
      <p className="text-gray-600">{coffee.category}</p>
      <p className="text-xs text-gray-400">Aggiornato: {formattedDate}</p>
    </div>
  );
}

// Memoizziamo il componente per evitare re-render inutili
export default memo(CoffeeCard);