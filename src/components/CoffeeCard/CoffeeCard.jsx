import { memo } from "react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";

function CoffeeCard(props) {
  const coffee = props.coffee;
  const onClick = props.onClick;
  const isFavorite = props.isFavorite;
  const onToggleFavorite = props.onToggleFavorite;

  function handleFavoriteClick(event) {
    event.stopPropagation();
    onToggleFavorite(coffee.id);
  }

  function handleCardClick() {
    onClick(coffee.id);
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  }

  let ariaLabel;
  if (isFavorite === true) {
    ariaLabel = "Rimuovi " + coffee.title + " dai preferiti";
  } else {
    ariaLabel = "Aggiungi " + coffee.title + " ai preferiti";
  }

  let heartIcon;
  if (isFavorite === true) {
    heartIcon = <HeartSolid className="w-5 h-5" />;
  } else {
    heartIcon = <HeartOutline className="w-5 h-5" />;
  }

  return (
    <article
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={"Vedi dettagli per " + coffee.title}
      className="relative cursor-pointer rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-600 transition"
    >
      <header className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
          <span aria-hidden="true" className="text-xl">
            ☕
          </span>
          {coffee.title}
        </h2>

        <button
          onClick={handleFavoriteClick}
          aria-label={ariaLabel}
          className="text-green-600 hover:text-red-500 focus:outline-none"
        >
          {heartIcon}
        </button>
      </header>

      <div className="text-gray-700 mb-4 space-y-1">
        <p>
          <strong>Categoria:</strong> {coffee.category}
        </p>

        {coffee.origin !== undefined && coffee.origin !== null && (
          <p>
            <strong>Origine:</strong> {coffee.origin}
          </p>
        )}

        {isFavorite === true && (
          <span className="sr-only">Questo caffè è nei tuoi preferiti</span>
        )}
      </div>

      <footer className="text-sm text-gray-500">
        <span>Clicca per maggiori dettagli</span>
      </footer>
    </article>
  );
}

export default memo(CoffeeCard);
