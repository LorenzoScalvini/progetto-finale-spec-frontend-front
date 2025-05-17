import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  ArrowPathIcon,
  ScaleIcon,
  TrophyIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
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
  icon: React.ReactNode;
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

  // Comparison configuration with icons
  const comparisonItems: ComparisonItem[] = [
    { 
      label: 'Category', 
      value: c => c.category,
      icon: <ScaleIcon className="icon" width={18} /> 
    },
    { 
      label: 'Origin', 
      value: c => c.origin,
      icon: <SparklesIcon className="icon" width={18} /> 
    },
    { 
      label: 'Roast Level', 
      value: c => c.roastLevel,
      icon: <ClockIcon className="icon" width={18} /> 
    },
    { 
      label: 'Flavor Profile', 
      value: c => c.flavor.join(', '),
      icon: <TrophyIcon className="icon" width={18} /> 
    },
    { 
      label: 'Acidity', 
      value: c => `${c.acidity}/10`, 
      isNumeric: true,
      icon: <ArrowTrendingUpIcon className="icon" width={18} /> 
    },
    { 
      label: 'Body', 
      value: c => `${c.body}/10`, 
      isNumeric: true,
      icon: <ArrowTrendingDownIcon className="icon" width={18} /> 
    },
    { 
      label: 'Price', 
      value: c => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(c.price),
      isNumeric: true,
      icon: <ScaleIcon className="icon" width={18} /> 
    },
    { 
      label: 'Packaging', 
      value: c => c.packaging,
      icon: <SparklesIcon className="icon" width={18} /> 
    },
    { 
      label: 'Organic', 
      value: c => c.organic ? 'Yes' : 'No',
      icon: <TrophyIcon className="icon" width={18} /> 
    }
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

  // Get appropriate icon for comparison result
  const getResultIcon = (result: string) => {
    switch(result) {
      case 'higher':
        return <ArrowTrendingUpIcon width={16} />;
      case 'lower':
        return <ArrowTrendingDownIcon width={16} />;
      case 'equal':
        return <ArrowsRightLeftIcon width={16} />;
      default:
        return <SparklesIcon width={16} />;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>
          <ScaleIcon width={24} />
          Coffee Comparison
        </h1>
        <div className={styles.actions}>
          <button onClick={() => navigate('/')}>
            <HomeIcon width={18} />
            Back to Menu
          </button>
          <button 
            onClick={resetComparison}
            disabled={!coffees[0] && !coffees[1]}
          >
            <ArrowPathIcon width={18} />
            Reset
          </button>
        </div>
      </header>

      <div className={styles.selectorContainer}>
        {(['first', 'second'] as const).map(position => (
          <div key={position} className={styles.selector}>
            <label>
              <TrophyIcon width={18} />
              {position === 'first' ? 'First' : 'Second'} Coffee
            </label>
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
            {loading[position] && (
              <span className={styles.loadingIndicator}>
                <ClockIcon width={16} />
                Loading...
              </span>
            )}
            {error[position] && (
              <span className={styles.error}>
                <ExclamationTriangleIcon width={16} />
                {error[position]}
              </span>
            )}
          </div>
        ))}
      </div>

      {coffees[0] && coffees[1] && (
        <div className={styles.comparison}>
          <div className={styles.comparisonGrid}>
            <div className={styles.gridHeader}>
              <ScaleIcon width={18} />
              Property
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon width={18} />
              {coffees[0].title}
            </div>
            <div className={styles.gridHeader}>
              <ArrowsRightLeftIcon width={18} />
              Comparison
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon width={18} />
              {coffees[1].title}
            </div>

            {comparisonItems.map((item, index) => {
              const result = getComparisonResult(coffees[0]!, coffees[1]!, item);
              return (
                <React.Fragment key={index}>
                  <div className={styles.propertyLabel}>
                    {item.icon}
                    {item.label}
                  </div>
                  <div>{item.value(coffees[0]!)}</div>
                  <div className={styles[result]}>
                    {getResultIcon(result)}
                    {result}
                  </div>
                  <div>{item.value(coffees[1]!)}</div>
                </React.Fragment>
              );
            })}
          </div>

          <div className={styles.visualComparison}>
            <h3>
              <SparklesIcon width={24} />
              Visual Comparison
            </h3>
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