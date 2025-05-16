import React from 'react';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';

interface StarbucksNavbarProps {
  logoSrc: string;
  brandName?: string;
  altText?: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

const Navbar: React.FC<StarbucksNavbarProps> = ({
  logoSrc,
  brandName = 'Starbucks',
  altText = 'Starbucks Logo',
  buttonLabel = 'Ordina ora',
  onButtonClick
}) => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        <div className={styles.logoContainer}>
          <img src={logoSrc} alt={altText} className={styles.logo} />
        </div> {brandName}
      </Link>

      <div className={styles.actions}>
        <Link to="/" className={styles.linkButton}>Home</Link>
        <Link to="/coffeesfavorite" className={styles.linkButton}>Preferiti</Link>
        <Link to="/coffeecomparator" className={styles.linkButton}>Confronta</Link>

        <button className={styles.button} onClick={onButtonClick}>
          {buttonLabel}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;