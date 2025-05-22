import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./FavoritesList.module.css";
import { HeartIcon as CuoreVuoto } from "@heroicons/react/24/outline";
import { useCoffee } from "../../contexts/CoffeeContext";

/**
 * Componente per la visualizzazione e gestione della lista dei caffè preferiti dell'utente.
 * Mostra tutti i caffè che sono stati aggiunti ai preferiti e permette la navigazione
 * verso i dettagli di ciascun caffè. Include uno stato vuoto quando non ci sono preferiti.
 *
 * @component
 * @returns {JSX.Element} L'interfaccia della lista dei caffè preferiti
 */
export default function ListaPreferiti() {
  // Hook per la navigazione programmatica tra le pagine
  const naviga = useNavigate();

  // Estrazione dei dati e funzioni dal contesto globale dei caffè
  const {
    coffees: tuttiICaffe,
    favorites: idCaffePreferiti,
    loading: statoCaricamento,
    toggleFavorite: commutaPreferito,
  } = useCoffee();

  /**
   * Filtro per ottenere solo i caffè che sono stati aggiunti ai preferiti.
   * Utilizza l'array degli ID preferiti per trovare i corrispondenti oggetti caffè completi.
   */
  const caffePreferiti = tuttiICaffe.filter((caffe) =>
    idCaffePreferiti.includes(caffe.id)
  );

  /**
   * Renderizzazione dello stato di caricamento con spinner e messaggio personalizzato.
   */
  if (statoCaricamento) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} aria-hidden="true"></div>
        <p>Caricamento dei tuoi caffè preferiti...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sezione header con titolo e icona rappresentativa */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.heartIcon} role="img" aria-label="Cuore">
            ❤️
          </span>
          <span>I Miei Caffè del Cuore</span>
        </h1>
      </div>

      {/* Renderizzazione condizionale basata sulla presenza di preferiti */}
      {!caffePreferiti.length ? (
        // Stato vuoto quando non ci sono caffè preferiti
        <div className={styles.emptyState}>
          <CuoreVuoto className={styles.emptyIcon} aria-hidden="true" />

          <div className={styles.emptyContent}>
            <h2>Nessun Caffè Preferito</h2>
            <p>
              Non hai ancora aggiunto nessun caffè alla tua lista dei preferiti.
            </p>
            <p>
              Esplora la nostra collezione e clicca sull'icona del cuore per
              salvare i tuoi caffè preferiti!
            </p>

            <button
              onClick={() => naviga("/")}
              className={styles.browseButton}
              aria-label="Vai alla lista completa dei caffè"
            >
              <span>Esplora la Collezione</span>
            </button>
          </div>
        </div>
      ) : (
        // Lista dei caffè preferiti quando ce ne sono
        <>
          {/* Informazioni sui risultati */}
          <div className={styles.resultsInfo}>
            <span>
              <strong>{caffePreferiti.length}</strong> caffè preferit
              {caffePreferiti.length === 1 ? "o" : "i"} nella tua collezione
            </span>
          </div>

          {/* Griglia con le card dei caffè preferiti */}
          <div className={styles.grid}>
            {caffePreferiti.map((caffe) => (
              <CoffeeCard
                key={caffe.id}
                coffee={caffe}
                onClick={() => naviga(`/coffees/${caffe.id}`)}
                isFavorite={true} // Tutti i caffè in questa lista sono preferiti
                onToggleFavorite={commutaPreferito}
              />
            ))}
          </div>

          {/* Suggerimenti per ulteriori azioni */}
          <div className={styles.actionHints}>
            <p>
              💡 <strong>Suggerimento:</strong> Clicca su un caffè per vedere
              tutti i dettagli o rimuovilo dai preferiti cliccando nuovamente
              sul cuore.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
