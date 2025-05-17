import React from 'react';
import styles from './Footer.module.css';
import {
  EnvelopeIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
  HomeIcon,
  HeartIcon,
  ScaleIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

import {
  FaceSmileIcon as FacebookIcon,
  ChatBubbleLeftRightIcon as TwitterIcon,
  CameraIcon as InstagramIcon
} from '@heroicons/react/24/outline';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        {/* Top Section */}
        <div className={styles.footerTop}>
          <div className={styles.footerAbout}>
            <h3 className={styles.footerHeading}>About Us</h3>
            <p className={styles.footerText}>
              Since 1971, Starbucks has been committed to ethically sourcing and roasting high-quality arabica coffee.
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

          {/* Quick Links */}
          <div className={styles.footerLinks}>
            <h3 className={styles.footerHeading}>Quick Links</h3>
            <ul className={styles.linkList}>
              <li className={styles.linkItem}>
                <HomeIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>Home</a>
              </li>
              <li className={styles.linkItem}>
                <HeartIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>Rewards</a>
              </li>
              <li className={styles.linkItem}>
                <ScaleIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>Responsibility</a>
              </li>
              <li className={styles.linkItem}>
                <ShoppingBagIcon className={styles.linkIcon} />
                <a href="#" className={styles.link}>Products</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.footerContact}>
            <h3 className={styles.footerHeading}>Contact Us</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <MapPinIcon className={styles.contactIcon} />
                <span>123 Coffee Street, Seattle, WA</span>
              </li>
              <li className={styles.contactItem}>
                <PhoneIcon className={styles.contactIcon} />
                <span>1-800-STARBUC</span>
              </li>
              <li className={styles.contactItem}>
                <EnvelopeIcon className={styles.contactIcon} />
                <span>customerservice@starbucks.com</span>
              </li>
              <li className={styles.contactItem}>
                <ClockIcon className={styles.contactIcon} />
                <span>Mon-Fri: 6AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            &copy; {new Date().getFullYear()} Starbucks Coffee Company. All rights reserved.
          </div>
          <div className={styles.legalLinks}>
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
            <a href="#" className={styles.legalLink}>Terms of Use</a>
            <a href="#" className={styles.legalLink}>CA Supply Chain Act</a>
            <a href="#" className={styles.legalLink}>Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;