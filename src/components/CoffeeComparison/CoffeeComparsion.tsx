import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CoffeeComparison.module.css';

type Coffee = {
  id: number;
  title: string;
  category: string;
  origin: string;
  roastLevel: string;
  flavor: string[];
  acidity: number;
  body: number;
  price: number;
  packaging: string;
  organic: boolean;
  description: string;
  imageUrl?: string;
};

type ComparisonItem = {
  label: string;
  value: (coffee: Coffee) => string | number;
  isNumeric?: boolean;
};

export default function CoffeeComparison() {
  const navigate = useNavigate();
  const [coffees, setCoffees] = useState<[Coffee | null, Coffee | null]>([null, null]);
  const [allCoffees, setAllCoffees] = useState<{id: number, title: string}[]>([]);
  const [loading, setLoading] = useState({ all: true, first: false, second: false });
  const [error, setError] = useState<{ first?: string, second?: string }>({});

  // Fetch all available coffees for dropdown
  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await fetch('http://localhost:3001/coffees');
        if (!response.ok) throw new Error('Failed to fetch coffees');
        const data = await response.json();
        setAllCoffees(data.map((c: any) => ({ id: c.id, title: c.title })));
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(prev => ({ ...prev, all: false }));
      }
    };
    fetchCoffees();
  }, []);

  // Fetch details for a specific coffee
  const fetchCoffee = async (id: number, position: 'first' | 'second') => {
    if (!id) return;
    
    setLoading(prev => ({ ...prev, [position]: true }));
    setError(prev => ({ ...prev, [position]: undefined }));

    try {
      const response = await fetch(`http://localhost:3001/coffees/${id}`);
      if (!response.ok) throw new Error('Coffee not found');
      
      const data = await response.json();
      const coffee = data.success ? data.coffee : data;
      
      setCoffees(prev => {
        const newCoffees = [...prev] as [Coffee | null, Coffee | null];
        newCoffees[position === 'first' ? 0 : 1] = coffee;
        return newCoffees;
      });
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        [position]: err instanceof Error ? err.message : 'Unknown error' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [position]: false }));
    }
  };

  const handleSelect = (position: 'first' | 'second', id: string) => {
    const numId = id ? parseInt(id) : null;
    setCoffees(prev => {
      const newCoffees = [...prev] as [Coffee | null, Coffee | null];
      newCoffees[position === 'first' ? 0 : 1] = numId ? null : null;
      return newCoffees;
    });
    if (numId) fetchCoffee(numId, position);
  };

  const resetComparison = () => setCoffees([null, null]);

  // Comparison configuration
  const comparisonItems: ComparisonItem[] = [
    { label: 'Category', value: c => c.category },
    { label: 'Origin', value: c => c.origin },
    { label: 'Roast Level', value: c => c.roastLevel },
    { label: 'Flavor Profile', value: c => c.flavor.join(', ') },
    { label: 'Acidity', value: c => `${c.acidity}/10`, isNumeric: true },
    { label: 'Body', value: c => `${c.body}/10`, isNumeric: true },
    { 
      label: 'Price', 
      value: c => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(c.price),
      isNumeric: true
    },
    { label: 'Packaging', value: c => c.packaging },
    { label: 'Organic', value: c => c.organic ? 'Yes' : 'No' }
  ];

  // Comparison result logic
  const getComparisonResult = (a: Coffee, b: Coffee, item: ComparisonItem) => {
    const valA = item.value(a);
    const valB = item.value(b);
    
    if (item.isNumeric && typeof valA === 'string' && typeof valB === 'string') {
      const numA = parseFloat(valA);
      const numB = parseFloat(valB);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA > numB ? 'higher' : numA < numB ? 'lower' : 'equal';
      }
    }
    return valA === valB ? 'equal' : 'different';
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Coffee Comparison</h1>
        <div className={styles.actions}>
          <button onClick={() => navigate('/')}>← Back to Menu</button>
          <button 
            onClick={resetComparison}
            disabled={!coffees[0] && !coffees[1]}
          >
            Reset
          </button>
        </div>
      </header>

      <div className={styles.selectorContainer}>
        {(['first', 'second'] as const).map(position => (
          <div key={position} className={styles.selector}>
            <label>{position === 'first' ? 'First' : 'Second'} Coffee</label>
            <select
              value={coffees[position === 'first' ? 0 : 1]?.id || ''}
              onChange={e => handleSelect(position, e.target.value)}
              disabled={loading.all}
            >
              <option value="">Select coffee</option>
              {allCoffees.map(coffee => (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.title}
                </option>
              ))}
            </select>
            {loading[position] && <span className={styles.loadingIndicator}>Loading...</span>}
            {error[position] && <span className={styles.error}>{error[position]}</span>}
          </div>
        ))}
      </div>

      {coffees[0] && coffees[1] && (
        <div className={styles.comparison}>
          <div className={styles.comparisonGrid}>
            <div className={styles.gridHeader}>Property</div>
            <div className={styles.gridHeader}>{coffees[0].title}</div>
            <div className={styles.gridHeader}>Comparison</div>
            <div className={styles.gridHeader}>{coffees[1].title}</div>

            {comparisonItems.map(item => {
              const result = getComparisonResult(coffees[0]!, coffees[1]!, item);
              return (
                <>
                  <div className={styles.propertyLabel}>{item.label}</div>
                  <div>{item.value(coffees[0]!)}</div>
                  <div className={styles[result]}>{result}</div>
                  <div>{item.value(coffees[1]!)}</div>
                </>
              );
            })}
          </div>

          <div className={styles.visualComparison}>
            <h3>Visual Comparison</h3>
            <div className={styles.coffeeCards}>
              {coffees.map((coffee, i) => (
                <div key={i} className={styles.coffeeCard}>
                  <img 
                    src={coffee?.imageUrl || 'https://placehold.co/300x200?text=Coffee'} 
                    alt={coffee?.title} 
                  />
                  <h4>{coffee?.title}</h4>
                  <p>{coffee?.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}