import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CoffeeCard from '../CoffeeCard/CoffeeCard';
import { Coffee } from '../../types/coffee';
import styles from './CoffeeList.module.css';

export default function CoffeeList() {
  const [state, setState] = useState({
    coffees: [] as Coffee[],
    searchTerm: '',
    displayedSearchTerm: '',
    selectedCategory: '',
    isLoading: true,
    sortBy: 'none' as 'none' | 'title' | 'category',
    sortDirection: 'asc' as 'asc' | 'desc'
  });
  
  const navigate = useNavigate();
  const debounceTimer = useRef<number | null>(null);

  const { coffees, searchTerm, displayedSearchTerm, selectedCategory, isLoading, sortBy, sortDirection } = state;

  useEffect(() => {
    const fetchCoffees = async () => {
      try {
        const response = await fetch('http://localhost:3001/coffees');
        if (!response.ok) throw new Error('Failed to fetch coffees');
        
        const data = await response.json();
        setState(prevState => ({
          ...prevState,
          coffees: data,
          isLoading: false
        }));
      } catch (error) {
        console.error('Error fetching coffees:', error);
        setState(prevState => ({ ...prevState, isLoading: false }));
      }
    };
    
    fetchCoffees();
  }, []);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = window.setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        displayedSearchTerm: prevState.searchTerm
      }));
    }, 300);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchTerm]);

  const handleCardClick = useCallback((id: number) => {
    navigate(`/coffees/${id}`);
  }, [navigate]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({
      ...prevState,
      searchTerm: e.target.value
    }));
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prevState => ({
      ...prevState,
      selectedCategory: e.target.value,
      sortBy: e.target.value ? 'category' : 'none',
      sortDirection: 'asc'
    }));
  }, []);

  const toggleAlphabeticalSort = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      sortBy: 'title',
      sortDirection: prevState.sortBy === 'title' && prevState.sortDirection === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const categories = useMemo(() => 
    ['', ...new Set(coffees.map(coffee => coffee.category))], 
    [coffees]
  );

  const filteredCoffees = useMemo(() => {
    let result = coffees.filter(coffee => 
      coffee.title.toLowerCase().includes(displayedSearchTerm.toLowerCase()) &&
      (!selectedCategory || coffee.category === selectedCategory)
    );

    if (sortBy === 'title') {
      result = [...result].sort((a, b) => {
        const compare = a.title.localeCompare(b.title);
        return sortDirection === 'asc' ? compare : -compare;
      });
    } else if (sortBy === 'category') {
      result = [...result].sort((a, b) => {
        const compare = a.category.localeCompare(b.category);
        return sortDirection === 'asc' ? compare : -compare;
      });
    }

    return result;
  }, [coffees, displayedSearchTerm, selectedCategory, sortBy, sortDirection]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading our premium coffees...</p>
      </div>
    );
  }

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