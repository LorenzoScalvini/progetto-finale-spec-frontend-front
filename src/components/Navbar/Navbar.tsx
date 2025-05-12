import React from 'react';
import styles from './Navbar.module.css';

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
      <div className={styles.brand}>
        <span className={styles.star}>★</span> {brandName}
      </div>

      <div className={styles.actions}>
        <button className={styles.linkButton}>Home</button>
        <button className={styles.linkButton}>Nuove Offerte</button>
        <button className={styles.linkButton}>Contattaci</button>

        <button className={styles.button} onClick={onButtonClick}>
          {buttonLabel}
        </button>

        <div className={styles.logoContainer}>
          <img src={logoSrc} alt={altText} className={styles.logo} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
