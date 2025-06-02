import React from "react";
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
    <footer className="bg-green-900 text-green-100 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:justify-between gap-12">
        {/* Section Chi Siamo */}
        <div className="lg:w-1/3 space-y-4">
          <h3 className="text-xl font-semibold border-b border-green-600 pb-2">
            Chi Siamo
          </h3>
          <p className="text-green-200">
            Dal 1971, Starbucks si impegna nell'approvvigionamento etico e nella
            tostatura di caffè arabica di alta qualità.
          </p>
          <div className="flex space-x-4 text-green-300 hover:text-white">
            <a href="#" aria-label="Facebook" className="hover:text-green-400">
              <FacebookIcon className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-green-400">
              <TwitterIcon className="w-6 h-6" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-green-400">
              <InstagramIcon className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Section Link Utili */}
        <div className="lg:w-1/3 space-y-4">
          <h3 className="text-xl font-semibold border-b border-green-600 pb-2">
            Link Utili
          </h3>
          <ul className="space-y-3 text-green-200">
            <li className="flex items-center gap-2 hover:text-white cursor-pointer">
              <HomeIcon className="w-5 h-5" />
              <a href="#">Home</a>
            </li>
            <li className="flex items-center gap-2 hover:text-white cursor-pointer">
              <HeartIcon className="w-5 h-5" />
              <a href="#">Ricompense</a>
            </li>
            <li className="flex items-center gap-2 hover:text-white cursor-pointer">
              <ScaleIcon className="w-5 h-5" />
              <a href="#">Responsabilità</a>
            </li>
            <li className="flex items-center gap-2 hover:text-white cursor-pointer">
              <ShoppingBagIcon className="w-5 h-5" />
              <a href="#">Prodotti</a>
            </li>
          </ul>
        </div>

        {/* Section Contattaci */}
        <div className="lg:w-1/3 space-y-4">
          <h3 className="text-xl font-semibold border-b border-green-600 pb-2">
            Contattaci
          </h3>
          <ul className="space-y-3 text-green-200">
            <li className="flex items-center gap-2">
              <MapPinIcon className="w-5 h-5" />
              <span>Via del Caffè 123, Seattle, WA</span>
            </li>
            <li className="flex items-center gap-2">
              <PhoneIcon className="w-5 h-5" />
              <span>1-800-STARBUC</span>
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="w-5 h-5" />
              <span>servizioclienti@starbucks.com</span>
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon className="w-5 h-5" />
              <span>Lun-Ven: 6:00 - 21:00</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-green-700 flex flex-col sm:flex-row justify-between text-green-400 text-sm gap-4">
        <div>
          &copy; {new Date().getFullYear()} Starbucks Coffee Company. Tutti i
          diritti riservati.
        </div>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="hover:text-white">
            Informativa sulla privacy
          </a>
          <a href="#" className="hover:text-white">
            Termini di utilizzo
          </a>
          <a href="#" className="hover:text-white">
            California Supply Chain Act
          </a>
          <a href="#" className="hover:text-white">
            Preferenze cookie
          </a>
        </div>
      </div>
    </footer>
  );
}
