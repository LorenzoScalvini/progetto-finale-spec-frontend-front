import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CoffeeCard from '../CoffeeCard/CoffeeCard';
import styles from './CoffeeList.module.css';
import { ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// 1. TIPI E INTERFACCE
type SortBy = 'none' | 'title' | 'category';
type SortDirection = 'asc' | 'desc';

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

export default function CoffeeList() {
  // 2. STATI DEL COMPONENTE
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const navigate = useNavigate();

  // 3. EFFETTI (SIDE EFFECTS)
  // Effetto per il caricamento iniziale dei dati
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carica preferiti da localStorage
        const savedFavorites = localStorage.getItem('favoriteCoffees');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }

        // Carica lista caffè
        const response = await fetch('http://localhost:3001/coffees');
        if (!response.ok) throw new Error('Errore nel caricamento dei caffè');
        setCoffees(await response.json());
      } catch (error) {
        console.error('Errore nel caricamento dati:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Effetto per il debounce del termine di ricerca
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 4. HANDLER FUNCTIONS
  const handleCardClick = (id: number) => navigate(`/coffees/${id}`);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSortBy(e.target.value ? 'category' : 'none');
    setSortDirection('asc');
  };

  const toggleAlphabeticalSort = () => {
    setSortBy('title');
    setSortDirection(prev => sortBy === 'title' && prev === 'asc' ? 'desc' : 'asc');
  };

  const handleToggleFavorite = (id: number) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(favId => favId !== id)
      : [...favorites, id];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCoffees', JSON.stringify(newFavorites));
  };

  // 5. MEMOIZED VALUES
  // Estrae le categorie uniche dalla lista dei caffè
  const categories = useMemo(() => ['', ...new Set(coffees.map(c => c.category))], [coffees]);

  // Filtra e ordina i caffè in base ai criteri selezionati
  const filteredCoffees = useMemo(() => {
    let result = coffees.filter(c => 
      c.title.toLowerCase().includes(displayedSearchTerm.toLowerCase()) &&
      (!selectedCategory || c.category === selectedCategory)
    );

    // Ordinamento
    if (sortBy === 'title') {
      result.sort((a, b) => sortDirection === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title));
    } else if (sortBy === 'category') {
      result.sort((a, b) => sortDirection === 'asc' 
        ? a.category.localeCompare(b.category) 
        : b.category.localeCompare(a.category));
    }

    return result;
  }, [coffees, displayedSearchTerm, selectedCategory, sortBy, sortDirection]);

  // 6. RENDER CONDIZIONALE PER LO STATO DI CARICAMENTO
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Caricamento dei nostri caffè premium...</p>
      </div>
    );
  }

  // 7. RENDER PRINCIPALE
  return (
    <div className={styles.container}>
      {/* Intestazione con controlli */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.starbucksStar}>★</span> La Nostra Collezione di Caffè
        </h1>
        
        <div className={styles.controls}>
          {/* Barra di ricerca */}
          <div className={styles.searchContainer}>
            <MagnifyingGlassIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Trova il tuo caffè perfetto..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
          </div>
          
          {/* Selezione categoria */}
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.categorySelect}
          >
            <option value="">Tutte le Categorie</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Pulsante ordinamento */}
          <button 
            onClick={toggleAlphabeticalSort}
            className={`${styles.sortButton} ${sortBy === 'title' ? styles.active : ''}`}
          >
            {sortBy === 'title' ? (sortDirection === 'asc' ? 'A-Z ↓' : 'Z-A ↑') : 'Ordina A-Z'}
          </button>

          {/* Pulsante preferiti */}
          <button 
            onClick={() => navigate('/favorites')}
            className={styles.favoritesButton}
          >
            <span className={styles.favoritesText}>I Miei Preferiti</span>
            <ArrowRightIcon className={styles.favoritesIcon} />
          </button>
        </div>
      </div>

      {/* Informazioni sui risultati */}
      <div className={styles.resultsInfo}>
        Mostrati {filteredCoffees.length} di {coffees.length} selezioni premium
        {sortBy === 'category' && selectedCategory && ` (ordinati per categoria)`}
        {favorites.length > 0 && ` • ${favorites.length} nei preferiti`}
      </div>

      {/* Griglia dei caffè */}
      <div className={styles.grid}>
        {filteredCoffees.map(coffee => (
          <CoffeeCard 
            key={coffee.id} 
            coffee={coffee}
            onClick={handleCardClick}
            isFavorite={favorites.includes(coffee.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        ))}
      </div>

      {/* Messaggio per nessun risultato */}
      {filteredCoffees.length === 0 && (
        <div className={styles.noResults}>
          Nessun caffè trovato. Prova con un'altra ricerca.
        </div>
      )}
    </div>
  );
}