import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useCoffee } from "../../contexts/CoffeeContext";

export default function FavoritesList() {
  const navigate = useNavigate();
  const { coffees, favorites, loading, toggleFavorite } = useCoffee();

  const favoriteCoffees = coffees.filter((coffee) =>
    favorites.includes(coffee.id)
  );

  if (loading) {
    return (
      <section aria-busy="true" aria-live="polite" className="p-6 text-center">
        <p>Caricamento dei tuoi caffè preferiti...</p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-green-900">
          I miei caffè preferiti
        </h1>
      </header>

      {favoriteCoffees.length === 0 ? (
        <div className="text-center text-gray-700 space-y-4">
          <HeartIcon
            className="mx-auto h-12 w-12 text-red-500"
            aria-hidden="true"
          />
          <h2 className="text-xl font-medium">Nessun caffè preferito</h2>
          <p>Non hai ancora aggiunto caffè ai tuoi preferiti.</p>
          <p>
            Esplora la nostra collezione e clicca sull'icona del cuore per
            salvarli!
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 inline-block rounded bg-green-700 px-6 py-2 text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            Esplora la collezione
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4 text-green-900 font-semibold">
            <span>
              <strong>{favoriteCoffees.length}</strong> caffè{" "}
              {favoriteCoffees.length === 1 ? "preferito" : "preferiti"} nella
              tua collezione
            </span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteCoffees.map((coffee) => (
              <CoffeeCard
                key={coffee.id}
                coffee={coffee}
                onClick={() => navigate(`/coffees/${coffee.id}`)}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>

          <footer className="mt-6 text-sm text-gray-600">
            <p>
              Clicca su un caffè per vedere i dettagli o clicca di nuovo sul
              cuore per rimuoverlo dai preferiti.
            </p>
          </footer>
        </>
      )}
    </section>
  );
}
