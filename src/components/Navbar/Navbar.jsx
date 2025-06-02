import React from "react";
import { Link } from "react-router-dom";
import {
  HomeIcon,
  HeartIcon,
  ScaleIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function Navbar({
  logoSrc,
  altText = "Starbucks Logo",
  buttonLabel = "Ordina ora",
  onButtonClick,
}) {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <Link to="/" className="flex items-center space-x-3">
        <img src={logoSrc} alt={altText} className="h-10 w-10 object-contain" />
        <span className="text-xl font-semibold text-green-700">Starbucks</span>
      </Link>

      <div className="flex items-center space-x-8">
        <Link
          to="/"
          className="flex items-center space-x-1 text-gray-700 hover:text-green-700 transition"
        >
          <HomeIcon className="h-6 w-6" />
          <span>Home</span>
        </Link>

        <Link
          to="/favorites"
          className="flex items-center space-x-1 text-gray-700 hover:text-green-700 transition"
        >
          <HeartIcon className="h-6 w-6" />
          <span>Preferiti</span>
        </Link>

        <Link
          to="/coffeecomparator"
          className="flex items-center space-x-1 text-gray-700 hover:text-green-700 transition"
        >
          <ScaleIcon className="h-6 w-6" />
          <span>Confronta</span>
        </Link>

        <button
          onClick={onButtonClick}
          className="flex items-center space-x-1 bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
        >
          <ShoppingBagIcon className="h-6 w-6" />
          <span>{buttonLabel}</span>
        </button>
      </div>
    </nav>
  );
}
