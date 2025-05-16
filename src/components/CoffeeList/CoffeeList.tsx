import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CoffeeCard from '../CoffeeCard/CoffeeCard';
import { Coffee } from '../../types/coffee';
import styles from './CoffeeList.module.css';

type SortBy = 'none' | 'title' | 'category';
type SortDirection = 'asc' | 'desc';

export default function CoffeeList() {
  const [coffees, setCoffees] = useState<Coffee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortBy>('none');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  const navigate = useNavigate();
  const debounceTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await fetch('http://localhost:3001/coffees');
        if (!response.ok) throw new Error('Failed to fetch coffees');
        setCoffees(await response.json());
      } catch (error) {
        console.error('Error fetching coffees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCoffees();
  }, []);

  useEffect(() => {
    debounceTimer.current = window.setTimeout(() => {
      setDisplayedSearchTerm(searchTerm);
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleCardClick = (id: number) => navigate(`/coffees/${id}`);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value);
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSortBy(e.target.value ? 'category' : 'none');
    setSortDirection('asc');
  };

  const toggleAlphabeticalSort = () => {
    setSortBy('title');
    setSortDirection(prev => sortBy === 'title' && prev === 'asc' ? 'desc' : 'asc');
  };

  const categories = useMemo(() => ['', ...new Set(coffees.map(c => c.category))], [coffees]);

  const filteredCoffees = useMemo(() => {
    let result = coffees.filter(c => 
      c.title.toLowerCase().includes(displayedSearchTerm.toLowerCase()) &&
      (!selectedCategory || c.category === selectedCategory)
    );

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

  if (isLoading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading our premium coffees...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.starbucksStar}>★</span> La nostra collezione
        </h1>
        
        <div className={styles.controls}>
          <input
            type="text"
            placeholder="Find your perfect coffee..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className={styles.categorySelect}
          >
            <option value="">All Categories</option>
            {categories.slice(1).map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <button 
            onClick={toggleAlphabeticalSort}
            className={`${styles.sortButton} ${sortBy === 'title' ? styles.active : ''}`}
          >
            {sortBy === 'title' ? (sortDirection === 'asc' ? 'A-Z ↓' : 'Z-A ↑') : 'Sort A-Z'}
          </button>
        </div>
      </div>

      <div className={styles.resultsInfo}>
        Showing {filteredCoffees.length} of {coffees.length} premium selections
        {sortBy === 'category' && selectedCategory && ` (sorted by category)`}
      </div>

      <div className={styles.grid}>
        {filteredCoffees.map(coffee => (
          <CoffeeCard 
            key={coffee.id} 
            coffee={coffee}
            onClick={handleCardClick}
          />
        ))}
      </div>

      {filteredCoffees.length === 0 && (
        <div className={styles.noResults}>
          No coffees found. Try a different search.
        </div>
      )}
    </div>
  );
}