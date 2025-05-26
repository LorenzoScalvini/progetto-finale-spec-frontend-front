import React from "react";
import styles from "./Footer.module.css";
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  HomeIcon,
  HeartIcon,
  ScaleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import {
  FaceSmileIcon as FacebookIcon,
  ChatBubbleLeftRightIcon as TwitterIcon,
  CameraIcon as InstagramIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerAbout}>
            <h3 className={styles.footerHeading}>Chi Siamo</h3>
            <p className={styles.footerText}>
              Dal 1971, Starbucks si impegna nell'approvvigionamento etico e
              nella tostatura di caffè arabica di alta qualità.
            </p>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink} aria-label="Facebook">
                <FacebookIcon className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter">
                <TwitterIcon className={styles.socialIcon} />
              </a>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <InstagramIcon className={styles.socialIcon} />
              </a>
            </div>
          </div>

          <div className={styles.footerLinks}>
            <h3 className={styles.footerHeading}>Link Utili</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <HomeIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>
                  Home
                </a>
              </li>
              <li className={styles.linkItem}>
                <HeartIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>
                  Ricompense
                </a>
              </li>
              <li className={styles.linkItem}>
                <ScaleIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>
                  Responsabilità
                </a>
              </li>
              <li className={styles.linkItem}>
                <ShoppingBagIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>
                  Prodotti
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerContact}>
            <h3 className={styles.footerHeading}>Contattaci</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPinIcon className={styles.contactIcon} />
                <span>Via del Caffè 123, Seattle, WA</span>
              </li>
              <li className={styles.contactItem}>
                <PhoneIcon className={styles.contactIcon} />
                <span>1-800-STARBUC</span>
              </li>
              <li className={styles.contactItem}>
                <EnvelopeIcon className={styles.contactIcon} />
                <span>servizioclienti@starbucks.com</span>
              </li>
              <li className={styles.contactItem}>
                <ClockIcon className={styles.contactIcon} />
                <span>Lun-Ven: 6:00 - 21:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Starbucks Coffee Company. Tutti i
            diritti riservati.
          </div>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>
              Informativa sulla privacy
            </a>
            <a href="#" className={styles.legalLink}>
              Termini di utilizzo
            </a>
            <a href="#" className={styles.legalLink}>
              California Supply Chain Act
            </a>
            <a href="#" className={styles.legalLink}>
              Preferenze cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
