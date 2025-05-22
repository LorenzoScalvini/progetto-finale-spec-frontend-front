import { memo } from "react";
import styles from "./CoffeeCard.module.css";
import { HeartIcon as CuorePieno } from "@heroicons/react/24/solid";
import { HeartIcon as CuoreVuoto } from "@heroicons/react/24/outline";

/**
 * Componente card per la rappresentazione visiva di un singolo caffè.
 * Visualizza le informazioni essenziali del caffè e permette l'interazione
 * per visualizzare i dettagli e gestire i preferiti. Ottimizzato con React.memo
 * per evitare ri-renderizzazioni non necessarie.
 *
 * @component
 * @param {Object} props - Le proprietà del componente
 * @param {Object} props.coffee - L'oggetto caffè con tutte le informazioni
 * @param {Function} props.onClick - Callback per il click sulla card
 * @param {boolean} props.isFavorite - Indica se il caffè è nei preferiti
 * @param {Function} props.onToggleFavorite - Callback per aggiungere/rimuovere dai preferiti
 * @returns {JSX.Element} La card del caffè
 */
function CardCaffe({
  coffee: caffe,
  onClick: alClick,
  isFavorite: èPreferito,
  onToggleFavorite: commutaPreferito,
}) {
  /**
   * Gestisce il click sul pulsante dei preferiti.
   * Previene la propagazione dell'evento per evitare che venga triggerato
   * anche il click sulla card principale.
   *
   * @function
   * @param {Event} evento - L'evento del click
   */
  const gestisciClickPreferito = (evento) => {
    // Previene la propagazione per evitare il trigger del click sulla card
    evento.stopPropagation();

    // Chiama la funzione di toggle passando l'ID del caffè
    commutaPreferito(caffe.id);
  };

  /**
   * Gestisce il click sulla card principale.
   * Chiama la funzione onClick passata come prop con l'ID del caffè.
   *
   * @function
   */
  const gestisciClickCard = () => {
    alClick(caffe.id);
  };

  /**
   * Gestisce la pressione dei tasti quando la card ha il focus.
   * Permette l'attivazione della card tramite tastiera (Enter e Spazio).
   *
   * @function
   * @param {KeyboardEvent} evento - L'evento della tastiera
   */
  const gestisciPressioneTasto = (evento) => {
    // Attiva la card con Enter o Spazio
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      gestisciClickCard();
    }
  };

  return (
    <article
      className={styles.card}
      onClick={gestisciClickCard}
      onKeyDown={gestisciPressioneTasto}
      role="button"
      tabIndex={0}
      aria-label={`Visualizza dettagli del caffè ${caffe.title}`}
    >
      {/* Header della card con titolo e pulsante preferiti */}
      <header className={styles.cardHeader}>
        <h2 className={styles.title}>
          <span className={styles.coffeeEmoji} aria-hidden="true">
            ☕
          </span>
          <span>{caffe.title}</span>
        </h2>

        {/* Pulsante per aggiungere/rimuovere dai preferiti */}
        <button
          onClick={gestisciClickPreferito}
          className={`${styles.favoriteButton} ${
            èPreferito ? styles.favoriteActive : styles.favoriteInactive
          }`}
          aria-label={
            èPreferito
              ? `Rimuovi ${caffe.title} dai preferiti`
              : `Aggiungi ${caffe.title} ai preferiti`
          }
          title={èPreferito ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
        >
          {èPreferito ? (
            <CuorePieno
              className={styles.favoriteIconSolid}
              aria-hidden="true"
            />
          ) : (
            <CuoreVuoto
              className={styles.favoriteIconOutline}
              aria-hidden="true"
            />
          )}
        </button>
      </header>

      {/* Contenuto principale della card */}
      <div className={styles.cardContent}>
        {/* Categoria del caffè */}
        <p
          className={styles.category}
          aria-label={`Categoria: ${caffe.category}`}
        >
          <span className={styles.categoryLabel}>Categoria:</span>
          <span className={styles.categoryValue}>{caffe.category}</span>
        </p>

        {/* Informazioni aggiuntive se disponibili */}
        {caffe.origin && (
          <p className={styles.origin}>
            <span className={styles.originLabel}>Origine:</span>
            <span className={styles.originValue}>{caffe.origin}</span>
          </p>
        )}

        {/* Indicatore di stato preferito per screen reader */}
        <span className={styles.srOnly}>
          {èPreferito ? "Questo caffè è nei tuoi preferiti" : ""}
        </span>
      </div>

      {/* Footer della card con call-to-action implicita */}
      <footer className={styles.cardFooter}>
        <span className={styles.viewDetailsHint}>
          Clicca per maggiori dettagli
        </span>
      </footer>
    </article>
  );
}

/**
 * Esportazione del componente memoizzato per ottimizzazioni delle performance.
 * React.memo previene le ri-renderizzazioni quando le props non cambiano.
 */
export default memo(CardCaffe);
