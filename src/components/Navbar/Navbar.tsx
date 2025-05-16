import React from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { 
  HomeIcon,
  HeartIcon,
  ScaleIcon,
  ShoppingBagIcon 
} from '@heroicons/react/24/outline';

interface StarbucksNavbarProps {
  logoSrc: string;
  brandName?: string;
  altText?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const Navbar: React.FC<StarbucksNavbarProps> = ({
  logoSrc,
  brandName = ' STARBUCKS',
  altText = 'Starbucks Logo',
  buttonLabel = 'Ordina ora',
  onButtonClick
}) => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <div className={styles.logoContainer}>
          <img src={logoSrc} alt={altText} className={styles.logo} />
        </div>
      </Link>

      <div className={styles.actions}>
        <Link to="/" className={styles.linkButton}>
          <HomeIcon className={styles.icon} />
          Home
        </Link>
        
        <Link to="/favorites" className={styles.linkButton}>
          <HeartIcon className={styles.icon} />
          Preferiti
        </Link>
        
        <Link to="/coffeecomparator" className={styles.linkButton}>
          <ScaleIcon className={styles.icon} />
          Confronta
        </Link>

        <button className={styles.button} onClick={onButtonClick}>
          <ShoppingBagIcon className={styles.icon} />
          {buttonLabel}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;