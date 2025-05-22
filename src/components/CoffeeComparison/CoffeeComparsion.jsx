import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  HomeIcon,
  ArrowPathIcon,
  ScaleIcon,
  TrophyIcon,
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  ArrowsRightLeftIcon,
  SparklesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import styles from "./CoffeeComparison.module.css";
import { useCoffee } from "../../contexts/CoffeeContext";

/**
 * Componente per il confronto dettagliato tra due caffè selezionati dall'utente.
 * Permette di visualizzare le caratteristiche di entrambi i caffè e confrontarle
 * direttamente attraverso una griglia di comparazione e una sezione visiva.
 *
 * @component
 * @returns {JSX.Element} L'interfaccia di confronto tra caffè
 */
export default function ConfrontoCaffe() {
  // Hook per la navigazione tra le pagine dell'applicazione
  const naviga = useNavigate();

  // Estrazione dei dati dal contesto globale dei caffè
  const { coffees: tuttiICaffe, getCoffeeById: ottieniCaffePerID } =
    useCoffee();

  // Stati locali del componente per gestire i caffè selezionati
  const [caffeSelezionati, setCaffeSelezionati] = useState([null, null]);

  // Stati per la gestione del caricamento asincrono dei dati
  const [statoCaricamento, setStatoCaricamento] = useState({
    primo: false,
    secondo: false,
  });

  // Stati per la gestione degli errori durante il caricamento
  const [erroriCaricamento, setErroriCaricamento] = useState({});

  /**
   * Carica i dettagli completi di un caffè dall'API utilizzando il suo ID.
   * Gestisce gli stati di caricamento e gli eventuali errori durante l'operazione.
   *
   * @async
   * @function
   * @param {string|number} idCaffe - L'identificativo univoco del caffè da caricare
   * @param {"primo"|"secondo"} posizione - Indica se il caffè va nella prima o seconda slot di confronto
   * @returns {Promise<void>} Una promise che si risolve quando il caricamento è completato
   */
  const caricaDettagliCaffe = async (idCaffe, posizione) => {
    // Verifica che sia stato fornito un ID valido
    if (!idCaffe) return;

    // Imposta lo stato di caricamento per la posizione specificata
    setStatoCaricamento((statoCorrente) => ({
      ...statoCorrente,
      [posizione]: true,
    }));

    // Reset dell'eventuale errore precedente per questa posizione
    setErroriCaricamento((erroriCorrente) => ({
      ...erroriCorrente,
      [posizione]: undefined,
    }));

    try {
      // Richiesta dei dettagli del caffè tramite il context
      const dettagliCaffe = await ottieniCaffePerID(idCaffe);

      // Aggiornamento dello stato con i dati ricevuti
      setCaffeSelezionati((caffeCorrente) => {
        const nuoviCaffe = [...caffeCorrente];
        nuoviCaffe[posizione === "primo" ? 0 : 1] = dettagliCaffe;
        return nuoviCaffe;
      });
    } catch (errore) {
      // Gestione degli errori con messaggio appropriato
      const messaggioErrore =
        errore instanceof Error
          ? errore.message
          : "Si è verificato un errore durante il caricamento del caffè";

      setErroriCaricamento((erroriCorrente) => ({
        ...erroriCorrente,
        [posizione]: messaggioErrore,
      }));
    } finally {
      // Reset dello stato di caricamento indipendentemente dal risultato
      setStatoCaricamento((statoCorrente) => ({
        ...statoCorrente,
        [posizione]: false,
      }));
    }
  };

  /**
   * Gestisce la selezione di un nuovo caffè da parte dell'utente.
   * Aggiorna lo stato locale e avvia il caricamento dei dettagli se necessario.
   *
   * @function
   * @param {"primo"|"secondo"} posizione - La posizione del caffè nel confronto
   * @param {string} idSelezionato - L'ID del caffè selezionato dal dropdown
   */
  const gestisciSelezioneCaffe = (posizione, idSelezionato) => {
    // Conversione dell'ID stringa in numero, null per valori vuoti
    const idNumerico = idSelezionato ? parseInt(idSelezionato, 10) : null;

    // Reset del caffè nella posizione specificata
    setCaffeSelezionati((caffeCorrente) => {
      const nuoviCaffe = [...caffeCorrente];
      nuoviCaffe[posizione === "primo" ? 0 : 1] = null;
      return nuoviCaffe;
    });

    // Caricamento dei dettagli se è stato selezionato un caffè valido
    if (idNumerico) {
      caricaDettagliCaffe(idNumerico, posizione);
    }
  };

  /**
   * Reset completo del confronto, rimuovendo entrambi i caffè selezionati.
   *
   * @function
   */
  const azzeraConfronto = () => {
    setCaffeSelezionati([null, null]);
    setErroriCaricamento({});
  };

  /**
   * Configurazione degli elementi che possono essere confrontati tra i due caffè.
   * Ogni elemento definisce come estrarre e visualizzare una specifica proprietà.
   * Memoizzato per ottimizzare le performance ed evitare ricreazioni non necessarie.
   */
  const elementiDiConfronto = useMemo(
    () => [
      {
        etichetta: "Categoria",
        estraiValore: (caffe) => caffe.category,
        icona: <ScaleIcon className="icon" width={18} />,
        descrizione: "La categoria di appartenenza del caffè",
      },
      {
        etichetta: "Origine",
        estraiValore: (caffe) => caffe.origin,
        icona: <SparklesIcon className="icon" width={18} />,
        descrizione: "Il paese o la regione di provenienza",
      },
      {
        etichetta: "Livello di Tostatura",
        estraiValore: (caffe) => caffe.roastLevel,
        icona: <ClockIcon className="icon" width={18} />,
        descrizione: "L'intensità della tostatura applicata",
      },
      {
        etichetta: "Profilo Aromatico",
        estraiValore: (caffe) => caffe.flavor?.join(", ") || "Non specificato",
        icona: <TrophyIcon className="icon" width={18} />,
        descrizione: "Le note di sapore predominanti",
      },
      {
        etichetta: "Acidità",
        estraiValore: (caffe) => `${caffe.acidity}/10`,
        èValoreNumerico: true,
        icona: <ArrowTrendingUpIcon className="icon" width={18} />,
        descrizione: "Il livello di acidità percepita",
      },
      {
        etichetta: "Corpo",
        estraiValore: (caffe) => `${caffe.body}/10`,
        èValoreNumerico: true,
        icona: <ArrowTrendingDownIcon className="icon" width={18} />,
        descrizione: "La consistenza e il peso in bocca",
      },
      {
        etichetta: "Prezzo",
        estraiValore: (caffe) =>
          new Intl.NumberFormat("it-IT", {
            style: "currency",
            currency: "EUR",
          }).format(caffe.price),
        èValoreNumerico: true,
        icona: <ScaleIcon className="icon" width={18} />,
        descrizione: "Il costo del prodotto",
      },
      {
        etichetta: "Confezione",
        estraiValore: (caffe) => caffe.packaging,
        icona: <SparklesIcon className="icon" width={18} />,
        descrizione: "Il tipo di imballaggio utilizzato",
      },
      {
        etichetta: "Biologico",
        estraiValore: (caffe) => (caffe.organic ? "Sì" : "No"),
        icona: <TrophyIcon className="icon" width={18} />,
        descrizione: "Certificazione biologica del prodotto",
      },
    ],
    []
  );

  /**
   * Determina il risultato del confronto tra due valori di caffè per una specifica proprietà.
   * Gestisce sia confronti numerici che testuali restituendo un risultato standardizzato.
   *
   * @function
   * @param {Object} primoCaffe - Il primo caffè da confrontare
   * @param {Object} secondoCaffe - Il secondo caffè da confrontare
   * @param {Object} elemento - La configurazione dell'elemento di confronto
   * @returns {"superiore"|"inferiore"|"uguale"|"diverso"} Il risultato del confronto
   */
  const determinaRisultatoConfronto = (primoCaffe, secondoCaffe, elemento) => {
    // Estrazione dei valori usando la funzione definita nell'elemento
    const valorePrimo = elemento.estraiValore(primoCaffe);
    const valoreSecondo = elemento.estraiValore(secondoCaffe);

    // Confronto numerico per elementi che supportano questa modalità
    if (
      elemento.èValoreNumerico &&
      typeof valorePrimo === "string" &&
      typeof valoreSecondo === "string"
    ) {
      const numeroPrimo = parseFloat(valorePrimo);
      const numeroSecondo = parseFloat(valoreSecondo);

      if (!isNaN(numeroPrimo) && !isNaN(numeroSecondo)) {
        if (numeroPrimo > numeroSecondo) return "superiore";
        if (numeroPrimo < numeroSecondo) return "inferiore";
        return "uguale";
      }
    }

    // Confronto generico per valori non numerici
    return valorePrimo === valoreSecondo ? "uguale" : "diverso";
  };

  /**
   * Restituisce l'icona appropriata per visualizzare il risultato di un confronto.
   *
   * @function
   * @param {"superiore"|"inferiore"|"uguale"|"diverso"} risultato - Il tipo di risultato
   * @returns {JSX.Element} L'icona React corrispondente al risultato
   */
  const ottieniIconaPerRisultato = (risultato) => {
    const icone = {
      superiore: <ArrowTrendingUpIcon width={16} />,
      inferiore: <ArrowTrendingDownIcon width={16} />,
      uguale: <ArrowsRightLeftIcon width={16} />,
      diverso: <SparklesIcon width={16} />,
    };

    return icone[risultato] || icone.diverso;
  };

  return (
    <div className={styles.container}>
      {/* Sezione header con titolo e controlli principali */}
      <header className={styles.header}>
        <h1>
          <ScaleIcon width={24} />
          Confronto Dettagliato Caffè
        </h1>
        <div className={styles.actions}>
          <button
            onClick={() => naviga("/")}
            className={styles.homeButton}
            aria-label="Torna alla pagina principale"
          >
            <HomeIcon width={18} />
            Torna al Menu Principale
          </button>
          <button
            onClick={azzeraConfronto}
            disabled={!caffeSelezionati[0] && !caffeSelezionati[1]}
            className={styles.resetButton}
            aria-label="Azzera il confronto corrente"
          >
            <ArrowPathIcon width={18} />
            Azzera Confronto
          </button>
        </div>
      </header>

      {/* Sezione selettori per la scelta dei caffè da confrontare */}
      <div className={styles.selectorContainer}>
        {["primo", "secondo"].map((posizione) => (
          <div key={posizione} className={styles.selector}>
            <label htmlFor={`selector-${posizione}`}>
              <TrophyIcon width={18} />
              {posizione === "primo" ? "Primo" : "Secondo"} Caffè da Confrontare
            </label>

            <select
              id={`selector-${posizione}`}
              value={caffeSelezionati[posizione === "primo" ? 0 : 1]?.id || ""}
              onChange={(evento) =>
                gestisciSelezioneCaffe(posizione, evento.target.value)
              }
              className={styles.coffeeSelector}
              aria-label={`Seleziona il ${posizione} caffè per il confronto`}
            >
              <option value="">-- Seleziona un caffè --</option>
              {tuttiICaffe.map((caffe) => (
                <option key={caffe.id} value={caffe.id}>
                  {caffe.title}
                </option>
              ))}
            </select>

            {/* Indicatore di caricamento durante il fetch dei dati */}
            {statoCaricamento[posizione] && (
              <div className={styles.loadingIndicator}>
                <ClockIcon width={16} />
                <span>Caricamento dettagli caffè...</span>
              </div>
            )}

            {/* Visualizzazione errori di caricamento */}
            {erroriCaricamento[posizione] && (
              <div className={styles.error} role="alert">
                <ExclamationTriangleIcon width={16} />
                <span>{erroriCaricamento[posizione]}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sezione risultati del confronto - visibile solo con entrambi i caffè selezionati */}
      {caffeSelezionati[0] && caffeSelezionati[1] && (
        <div className={styles.comparison}>
          {/* Griglia dettagliata di confronto delle proprietà */}
          <div className={styles.comparisonGrid}>
            {/* Intestazioni delle colonne della griglia */}
            <div className={styles.gridHeader}>
              <ScaleIcon width={18} />
              <span>Proprietà</span>
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon width={18} />
              <span>{caffeSelezionati[0].title}</span>
            </div>
            <div className={styles.gridHeader}>
              <ArrowsRightLeftIcon width={18} />
              <span>Confronto</span>
            </div>
            <div className={styles.gridHeader}>
              <TrophyIcon width={18} />
              <span>{caffeSelezionati[1].title}</span>
            </div>

            {/* Rendering di tutti gli elementi di confronto configurati */}
            {elementiDiConfronto.map((elemento, indice) => {
              const risultatoConfronto = determinaRisultatoConfronto(
                caffeSelezionati[0],
                caffeSelezionati[1],
                elemento
              );

              return (
                <React.Fragment key={indice}>
                  {/* Nome della proprietà con icona */}
                  <div
                    className={styles.propertyLabel}
                    title={elemento.descrizione}
                  >
                    {elemento.icona}
                    <span>{elemento.etichetta}</span>
                  </div>

                  {/* Valore per il primo caffè */}
                  <div className={styles.propertyValue}>
                    {elemento.estraiValore(caffeSelezionati[0])}
                  </div>

                  {/* Risultato del confronto con icona rappresentativa */}
                  <div
                    className={`${styles.comparisonResult} ${styles[risultatoConfronto]}`}
                  >
                    {ottieniIconaPerRisultato(risultatoConfronto)}
                    <span className={styles.resultText}>
                      {risultatoConfronto}
                    </span>
                  </div>

                  {/* Valore per il secondo caffè */}
                  <div className={styles.propertyValue}>
                    {elemento.estraiValore(caffeSelezionati[1])}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Sezione di confronto visivo con immagini e descrizioni */}
          <div className={styles.visualComparison}>
            <h3>
              <SparklesIcon width={24} />
              <span>Confronto Visivo</span>
            </h3>

            <div className={styles.coffeeCards}>
              {caffeSelezionati.map((caffe, indiceCaffe) => (
                <div
                  key={`visual-${indiceCaffe}`}
                  className={styles.coffeeCard}
                >
                  <div className={styles.imageContainer}>
                    <img
                      src={caffe?.imageUrl || "/api/placeholder/300/200"}
                      alt={`Immagine del caffè ${caffe?.title}`}
                      className={styles.coffeeImage}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/api/placeholder/300/200";
                        e.target.alt = "Immagine non disponibile";
                      }}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <h4 className={styles.coffeeTitle}>{caffe?.title}</h4>
                    <p className={styles.coffeeDescription}>
                      {caffe?.description || "Descrizione non disponibile"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
