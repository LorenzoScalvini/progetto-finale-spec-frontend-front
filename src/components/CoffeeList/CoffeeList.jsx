import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CoffeeCard from "../CoffeeCard/CoffeeCard";
import styles from "./CoffeeList.module.css";
import {
  ArrowRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useCoffee } from "../../contexts/CoffeeContext";

/**
 * Componente principale per la visualizzazione e gestione della lista completa dei caffè.
 * Offre funzionalità di ricerca, filtro per categoria, ordinamento e navigazione verso
 * i dettagli di ogni singolo caffè. Include anche la gestione dei preferiti.
 *
 * @component
 * @returns {JSX.Element} L'interfaccia della lista caffè con tutti i controlli
 */
export default function ListaCaffe() {
  // Hook per la navigazione programmatica tra le pagine
  const naviga = useNavigate();

  // Estrazione dei dati e funzioni dal contesto globale dei caffè
  const {
    coffees: tuttiICaffe,
    favorites: preferiti,
    loading: statoCaricamento,
    toggleFavorite: commutaPreferito,
  } = useCoffee();

  // Stati locali per la gestione della ricerca e dei filtri
  const [termineRicerca, setTermineRicerca] = useState("");
  const [termineRicercaVisualizzato, setTermineRicercaVisualizzato] =
    useState("");
  const [categoriaSelezionata, setCategoriaSelezionata] = useState("");
  const [criterioOrdinamento, setCriterioOrdinamento] = useState("nessuno");
  const [direzioneOrdinamento, setDirezioneOrdinamento] = useState("crescente");

  /**
   * Effetto per implementare il debouncing della ricerca.
   * Ritarda l'applicazione del filtro di ricerca per evitare troppe operazioni
   * durante la digitazione dell'utente, migliorando le performance.
   */
  useEffect(() => {
    const timerDebounce = setTimeout(() => {
      setTermineRicercaVisualizzato(termineRicerca);
    }, 300); // Attesa di 300ms dopo l'ultimo carattere digitato

    // Cleanup del timer per evitare memory leaks
    return () => clearTimeout(timerDebounce);
  }, [termineRicerca]);

  /**
   * Estrazione di tutte le categorie uniche disponibili nella collezione di caffè.
   * Include una stringa vuota come prima opzione per permettere di mostrare tutti i caffè.
   */
  const categorieDisponibili = [
    "",
    ...new Set(tuttiICaffe.map((caffe) => caffe.category)),
  ];

  /**
   * Applicazione dei filtri di ricerca e categoria alla lista completa dei caffè.
   * Utilizza la trasformazione funzionale per mantenere immutabilità dei dati originali.
   */
  let caffeFiltratiEOrdinati = tuttiICaffe.filter((caffe) => {
    // Verifica corrispondenza con il termine di ricerca (case-insensitive)
    const corrispondeRicerca = caffe.title
      .toLowerCase()
      .includes(termineRicercaVisualizzato.toLowerCase());

    // Verifica corrispondenza con la categoria selezionata
    const corrispondeCategoria =
      !categoriaSelezionata || caffe.category === categoriaSelezionata;

    return corrispondeRicerca && corrispondeCategoria;
  });

  /**
   * Applicazione dell'ordinamento alla lista filtrata.
   * Supporta ordinamento per titolo e categoria in entrambe le direzioni.
   */
  if (criterioOrdinamento === "titolo") {
    caffeFiltratiEOrdinati.sort((caffeA, caffeB) => {
      const confronto = caffeA.title.localeCompare(caffeB.title, "it-IT");
      return direzioneOrdinamento === "crescente" ? confronto : -confronto;
    });
  } else if (criterioOrdinamento === "categoria") {
    caffeFiltratiEOrdinati.sort((caffeA, caffeB) => {
      const confronto = caffeA.category.localeCompare(caffeB.category, "it-IT");
      return direzioneOrdinamento === "crescente" ? confronto : -confronto;
    });
  }

  /**
   * Gestisce il cambio di criterio e direzione per l'ordinamento per titolo.
   * Alterna tra crescente e decrescente quando viene cliccato più volte.
   *
   * @function
   */
  const gestisciOrdinamentoTitolo = () => {
    if (criterioOrdinamento === "titolo") {
      // Se già ordinato per titolo, alterna la direzione
      setDirezioneOrdinamento(
        direzioneOrdinamento === "crescente" ? "decrescente" : "crescente"
      );
    } else {
      // Se non ordinato per titolo, imposta ordinamento crescente
      setCriterioOrdinamento("titolo");
      setDirezioneOrdinamento("crescente");
    }
  };

  /**
   * Gestisce la selezione di una categoria dal dropdown.
   * Quando viene selezionata una categoria, automaticamente imposta l'ordinamento per categoria.
   *
   * @function
   * @param {string} nuovaCategoria - La categoria selezionata dall'utente
   */
  const gestisciSelezioneCategoria = (nuovaCategoria) => {
    setCategoriaSelezionata(nuovaCategoria);

    if (nuovaCategoria) {
      // Se è stata selezionata una categoria, ordina per categoria
      setCriterioOrdinamento("categoria");
      setDirezioneOrdinamento("crescente");
    } else {
      // Se non c'è categoria selezionata, rimuovi ordinamento
      setCriterioOrdinamento("nessuno");
    }
  };

  /**
   * Renderizzazione dello stato di caricamento con spinner e messaggio.
   */
  if (statoCaricamento) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} aria-hidden="true"></div>
        <p>Caricamento della nostra selezione premium di caffè...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Sezione header con titolo e controlli di ricerca/filtro */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className={styles.starbucksStar} aria-hidden="true">
            ★
          </span>
          <span>La Nostra Collezione Premium di Caffè</span>
        </h1>

        {/* Pannello controlli per ricerca, filtro e ordinamento */}
        <div className={styles.controls}>
          {/* Campo di ricerca con icona */}
          <div className={styles.searchContainer}>
            <MagnifyingGlassIcon
              className={styles.searchIcon}
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Cerca il caffè perfetto per te..."
              value={termineRicerca}
              onChange={(evento) => setTermineRicerca(evento.target.value)}
              className={styles.searchInput}
              aria-label="Campo di ricerca per caffè"
            />
          </div>

          {/* Selettore categoria */}
          <select
            value={categoriaSelezionata}
            onChange={(evento) =>
              gestisciSelezioneCategoria(evento.target.value)
            }
            className={styles.categorySelect}
            aria-label="Filtra per categoria di caffè"
          >
            <option value="">Tutte le Categorie</option>
            {categorieDisponibili.slice(1).map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>

          {/* Pulsante per ordinamento alfabetico */}
          <button
            onClick={gestisciOrdinamentoTitolo}
            className={`${styles.sortButton} ${
              criterioOrdinamento === "titolo" ? styles.active : ""
            }`}
            aria-label={`Ordina alfabeticamente ${
              criterioOrdinamento === "titolo"
                ? direzioneOrdinamento === "crescente"
                  ? "dalla Z alla A"
                  : "dalla A alla Z"
                : "dalla A alla Z"
            }`}
          >
            {criterioOrdinamento === "titolo"
              ? direzioneOrdinamento === "crescente"
                ? "Ordina A-Z ↓"
                : "Ordina Z-A ↑"
              : "Ordina A-Z"}
          </button>
        </div>
      </div>

      {/* Informazioni sui risultati e statistiche */}
      <div className={styles.resultsInfo}>
        <span>
          Mostrando <strong>{caffeFiltratiEOrdinati.length}</strong> di{" "}
          <strong>{tuttiICaffe.length}</strong> caffè della selezione premium
        </span>

        {criterioOrdinamento === "categoria" && categoriaSelezionata && (
          <span> • Ordinati per categoria</span>
        )}

        {preferiti.length > 0 && (
          <span>
            {" "}
            • <strong>{preferiti.length}</strong> nei preferiti
          </span>
        )}
      </div>

      {/* Griglia principale con le card dei caffè */}
      <div className={styles.grid}>
        {caffeFiltratiEOrdinati.map((caffe) => (
          <CoffeeCard
            key={caffe.id}
            coffee={caffe}
            onClick={() => naviga(`/coffees/${caffe.id}`)}
            isFavorite={preferiti.includes(caffe.id)}
            onToggleFavorite={commutaPreferito}
          />
        ))}
      </div>

      {/* Messaggio quando non ci sono risultati */}
      {caffeFiltratiEOrdinati.length === 0 && (
        <div className={styles.noResults}>
          <p>
            <span role="img" aria-label="Lente di ricerca">
              🔎
            </span>
            Nessun caffè trovato con i criteri di ricerca attuali.
          </p>
          <p>
            Prova a modificare il termine di ricerca o selezionare una categoria
            diversa.
          </p>
        </div>
      )}
    </div>
  );
}
