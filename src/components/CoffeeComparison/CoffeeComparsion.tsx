import React, { useState, useEffect, useMemo } from 'react';
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

// 1. TIPI E INTERFACCE
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

type LoadingState = {
  all: boolean;
  first: boolean;
  second: boolean;
};

type ErrorState = {
  first?: string;
  second?: string;
};

export default function CoffeeComparison() {
  const navigate = useNavigate();
  
  // 2. STATI DEL COMPONENTE
  const [coffees, setCoffees] = useState<[Coffee | null, Coffee | null]>([null, null]);
  const [allCoffees, setAllCoffees] = useState<{id: number, title: string}[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ all: true, first: false, second: false });
  const [error, setError] = useState<ErrorState>({});

  // 3. EFFETTI (SIDE EFFECTS)
  // Carica la lista dei caffè disponibili per i dropdown
  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await fetch('http://localhost:3001/coffees');
        if (!response.ok) throw new Error('Errore nel caricamento dei caffè');
        const data = await response.json();
        setAllCoffees(data.map((c: Coffee) => ({ id: c.id, title: c.title })));
      } catch (err) {
        console.error('Errore nel fetch:', err);
      } finally {
        setLoading(prev => ({ ...prev, all: false }));
      }
    };
    fetchCoffees();
  }, []);

  // 4. FUNZIONI PRINCIPALI
  // Carica i dettagli di un caffè specifico
  const fetchCoffee = async (id: number, position: 'first' | 'second') => {
    if (!id) return;
    
    setLoading(prev => ({ ...prev, [position]: true }));
    setError(prev => ({ ...prev, [position]: undefined }));

    try {
      const response = await fetch(`http://localhost:3001/coffees/${id}`);
      if (!response.ok) throw new Error('Caffè non trovato');
      
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
        [position]: err instanceof Error ? err.message : 'Errore sconosciuto' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, [position]: false }));
    }
  };

  // Gestisce la selezione di un caffè dal dropdown
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

  // 5. CONFIGURAZIONE COMPARAZIONE (MEMOIZZATA)
  const comparisonItems: ComparisonItem[] = useMemo(() => [
    { 
      label: 'Categoria', 
      value: c => c.category,
      icon: <ScaleIcon className="icon" width={18} /> 
    },
    { 
      label: 'Origine', 
      value: c => c.origin,
      icon: <SparklesIcon className="icon" width={18} /> 
    },
    { 
      label: 'Livello di tostatura', 
      value: c => c.roastLevel,
      icon: <ClockIcon className="icon" width={18} /> 
    },
    { 
      label: 'Profilo aromatico', 
      value: c => c.flavor.join(', '),
      icon: <TrophyIcon className="icon" width={18} /> 
    },
    { 
      label: 'Acidità', 
      value: c => `${c.acidity}/10`, 
      isNumeric: true,
      icon: <ArrowTrendingUpIcon className="icon" width={18} /> 
    },
    { 
      label: 'Corpo', 
      value: c => `${c.body}/10`, 
      isNumeric: true,
      icon: <ArrowTrendingDownIcon className="icon" width={18} /> 
    },
    { 
      label: 'Prezzo', 
      value: c => new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR'
      }).format(c.price),
      isNumeric: true,
      icon: <ScaleIcon className="icon" width={18} /> 
    },
    { 
      label: 'Confezione', 
      value: c => c.packaging,
      icon: <SparklesIcon className="icon" width={18} /> 
    },
    { 
      label: 'Biologico', 
      value: c => c.organic ? 'Sì' : 'No',
      icon: <TrophyIcon className="icon" width={18} /> 
    }
  ], []);

  // 6. LOGICA DI COMPARAZIONE
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

  // Restituisce l'icona appropriata per il risultato
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

  // 7. RENDER PRINCIPALE
  return (
    <div className={styles.container}>
      {/* Intestazione con azioni */}
      <header className={styles.header}>
        <h1>
          <ScaleIcon width={24} />
          Confronto Caffè
        </h1>
        <div className={styles.actions}>
          <button onClick={() => navigate('/')}>
            <HomeIcon width={18} />
            Torna al Menu
          </button>
          <button 
            onClick={resetComparison}
            disabled={!coffees[0] && !coffees[1]}
            aria-label="Resetta il confronto"
          >
            <ArrowPathIcon width={18} />
            Resetta
          </button>
        </div>
      </header>

      {/* Selettori dei caffè da confrontare */}
      <div className={styles.selectorContainer}>
        {(['first', 'second'] as const).map(position => (
          <div key={position} className={styles.selector}>
            <label>
              <TrophyIcon width={18} />
              {position === 'first' ? 'Primo' : 'Secondo'} Caffè
            </label>
            <select
              value={coffees[position === 'first' ? 0 : 1]?.id || ''}
              onChange={e => handleSelect(position, e.target.value)}
              disabled={loading.all}
              aria-label={`Seleziona ${position === 'first' ? 'primo' : 'secondo'} caffè`}
            >
              <option value="">Seleziona caffè</option>
              {allCoffees.map(coffee => (
                <option key={coffee.id} value={coffee.id}>
                  {coffee.title}
                </option>
              ))}
            </select>
            {loading[position] && (
              <span className={styles.loadingIndicator}>
                <ClockIcon width={16} />
                Caricamento...
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

      {/* Risultato del confronto */}
      {coffees[0] && coffees[1] && (
        <div className={styles.comparison}>
          {/* Griglia di confronto dettagliato */}
          <div className={styles.comparisonGrid}>
            <div className={styles.gridHeader}>
              <ScaleIcon width={18} />
              Proprietà
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon width={18} />
              {coffees[0].title}
            </div>
            <div className={styles.gridHeader}>
              <ArrowsRightLeftIcon width={18} />
              Confronto
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
                    {result === 'higher' ? 'maggiore' : 
                     result === 'lower' ? 'minore' : 
                     result === 'equal' ? 'uguale' : 'differente'}
                  </div>
                  <div>{item.value(coffees[1]!)}</div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Confronto visivo con immagini */}
          <div className={styles.visualComparison}>
            <h3>
              <SparklesIcon width={24} />
              Confronto Visivo
            </h3>
            <div className={styles.coffeeCards}>
              {coffees.map((coffee, i) => (
                <div key={i} className={styles.coffeeCard}>
                  <img 
                    src={coffee?.imageUrl || 'https://placehold.co/300x200?text=Caffè'} 
                    alt={coffee?.title} 
                    loading="lazy"
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