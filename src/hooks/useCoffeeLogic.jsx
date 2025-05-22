import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom Hook per la gestione centralizzata di tutta la logica di business relativa ai caffè.
 * Gestisce il caricamento dei dati dall'API, la persistenza dei preferiti nel localStorage,
 * e fornisce tutte le funzioni necessarie per l'interazione con i dati dei caffè.
 *
 * @function
 * @returns {Object} Oggetto contenente stati, dati e funzioni per la gestione dei caffè
 */
export function usaLogicaCaffe() {
  // Stati principali per la gestione dei dati dei caffè
  const [tuttiICaffe, setTuttiICaffe] = useState([]);

  // Gestione dei preferiti con inizializzazione dal localStorage
  const [preferiti, setPreferiti] = useState(() => {
    try {
      const preferitiSalvati = localStorage.getItem("caffePreferiti");
      return preferitiSalvati ? JSON.parse(preferitiSalvati) : [];
    } catch (errore) {
      console.warn(
        "Errore nel recupero dei preferiti dal localStorage:",
        errore
      );
      return [];
    }
  });

  // Stati per la gestione dello stato dell'applicazione
  const [statoCaricamento, setStatoCaricamento] = useState(true);
  const [erroreCaricamento, setErroreCaricamento] = useState(null);

  // Configurazione dell'URL base dell'API dal file di ambiente
  const urlBaseAPI = import.meta.env.VITE_API_BASE_URL;

  /**
   * Effetto per il caricamento iniziale dei caffè dall'API.
   * Si esegue al montaggio del componente e quando cambia l'URL base dell'API.
   */
  useEffect(() => {
    /**
     * Funzione asincrona per recuperare la lista completa dei caffè dall'API.
     * Gestisce la formattazione dei dati e la gestione degli errori.
     *
     * @async
     * @function
     */
    const caricaTuttiICaffe = async () => {
      try {
        // Imposta lo stato di caricamento
        setStatoCaricamento(true);
        setErroreCaricamento(null);

        // Chiamata API per ottenere la lista dei caffè
        const risposta = await axios.get(`${urlBaseAPI}/coffees`);

        // Gestione della formattazione della risposta API
        // Supporta diverse strutture di risposta per flessibilità
        const caffeFormattati = risposta.data.success
          ? risposta.data.coffees
          : risposta.data;

        // Validazione dei dati ricevuti
        if (!Array.isArray(caffeFormattati)) {
          throw new Error(
            "I dati ricevuti dall'API non sono nel formato array atteso"
          );
        }

        // Aggiornamento dello stato con i dati formattati
        setTuttiICaffe(caffeFormattati);

        console.log(`Caricati con successo ${caffeFormattati.length} caffè`);
      } catch (errore) {
        // Gestione centralizzata degli errori con messaggi user-friendly
        const messaggioErrore =
          errore.response?.data?.message ||
          errore.message ||
          "Si è verificato un errore durante il caricamento dei caffè";

        setErroreCaricamento(messaggioErrore);
        console.error("Errore nel caricamento dei caffè:", errore);
      } finally {
        // Reset dello stato di caricamento in ogni caso
        setStatoCaricamento(false);
      }
    };

    // Esecuzione del caricamento solo se l'URL base è configurato
    if (urlBaseAPI) {
      caricaTuttiICaffe();
    } else {
      setErroreCaricamento("URL dell'API non configurato correttamente");
      setStatoCaricamento(false);
    }
  }, [urlBaseAPI]);

  /**
   * Funzione per aggiungere o rimuovere un caffè dalla lista dei preferiti.
   * Gestisce la persistenza automatica nel localStorage e fornisce feedback console.
   *
   * @function
   * @param {number} idCaffe - L'identificativo univoco del caffè da aggiungere/rimuovere
   */
  const commutaPreferito = (idCaffe) => {
    try {
      // Validazione dell'input
      if (!idCaffe || typeof idCaffe !== "number") {
        console.warn("ID caffè non valido:", idCaffe);
        return;
      }

      setPreferiti((preferitiAttuali) => {
        let nuoviPreferiti;

        if (preferitiAttuali.includes(idCaffe)) {
          // Rimozione dai preferiti
          nuoviPreferiti = preferitiAttuali.filter(
            (idPreferito) => idPreferito !== idCaffe
          );
          console.log(`Caffè con ID ${idCaffe} rimosso dai preferiti`);
        } else {
          // Aggiunta ai preferiti
          nuoviPreferiti = [...preferitiAttuali, idCaffe];
          console.log(`Caffè con ID ${idCaffe} aggiunto ai preferiti`);
        }

        // Persistenza immediata nel localStorage
        try {
          localStorage.setItem(
            "caffePreferiti",
            JSON.stringify(nuoviPreferiti)
          );
        } catch (erroreStorage) {
          console.error("Errore nel salvataggio dei preferiti:", erroreStorage);
          // In caso di errore nel localStorage, continuiamo comunque con l'aggiornamento dello stato
        }

        return nuoviPreferiti;
      });
    } catch (errore) {
      console.error("Errore nella gestione dei preferiti:", errore);
    }
  };

  /**
   * Funzione per recuperare i dettagli completi di un singolo caffè dall'API.
   * Utilizzata per il caricamento lazy dei dettagli quando necessario.
   *
   * @async
   * @function
   * @param {number} idCaffe - L'identificativo del caffè da recuperare
   * @returns {Promise<Object>} Una promise che risolve con i dettagli del caffè
   * @throws {Error} Se il caffè non viene trovato o si verifica un errore
   */
  const ottieniCaffePerID = async (idCaffe) => {
    try {
      // Validazione dell'input
      if (!idCaffe) {
        throw new Error("ID del caffè richiesto per il recupero dei dettagli");
      }

      console.log(`Caricamento dettagli per il caffè ID: ${idCaffe}`);

      // Chiamata API per i dettagli specifici
      const risposta = await axios.get(`${urlBaseAPI}/coffees/${idCaffe}`);

      // Gestione della formattazione della risposta
      const dettagliCaffe = risposta.data.success
        ? risposta.data.coffee
        : risposta.data;

      // Validazione della risposta
      if (!dettagliCaffe) {
        throw new Error(`Nessun caffè trovato con ID: ${idCaffe}`);
      }

      console.log(`Dettagli caricati con successo per: ${dettagliCaffe.title}`);
      return dettagliCaffe;
    } catch (errore) {
      // Gestione specifica degli errori HTTP
      if (errore.response?.status === 404) {
        throw new Error(`Il caffè con ID ${idCaffe} non è stato trovato`);
      }

      if (errore.response?.status >= 500) {
        throw new Error("Errore del server. Riprova più tardi");
      }

      // Gestione di altri tipi di errore
      const messaggioErrore =
        errore.response?.data?.message ||
        errore.message ||
        "Errore nel recupero dei dettagli del caffè";

      console.error(`Errore nel recupero del caffè ${idCaffe}:`, errore);
      throw new Error(messaggioErrore);
    }
  };

  /**
   * Funzione helper per ottenere statistiche sui preferiti.
   * Utile per componenti che devono mostrare informazioni aggregate.
   *
   * @function
   * @returns {Object} Oggetto con statistiche sui preferiti
   */
  const ottieniStatistichePreferiti = () => {
    const numeroPreferiti = preferiti.length;
    const caffePreferiti = tuttiICaffe.filter((caffe) =>
      preferiti.includes(caffe.id)
    );

    return {
      numeroTotale: numeroPreferiti,
      caffeCompleti: caffePreferiti,
      percentuale:
        tuttiICaffe.length > 0
          ? (numeroPreferiti / tuttiICaffe.length) * 100
          : 0,
    };
  };

  /**
   * Funzione per verificare se un caffè specifico è nei preferiti.
   * Utile per componenti che devono controllare lo stato di un singolo caffè.
   *
   * @function
   * @param {number} idCaffe - L'ID del caffè da controllare
   * @returns {boolean} True se il caffè è nei preferiti, false altrimenti
   */
  const èNeiPreferiti = (idCaffe) => {
    return preferiti.includes(idCaffe);
  };

  // Restituzione di tutti gli stati e funzioni per l'utilizzo nei componenti
  return {
    // Dati principali
    coffees: tuttiICaffe, // Manteniamo il nome originale per compatibilità
    favorites: preferiti, // Manteniamo il nome originale per compatibilità

    // Stati dell'applicazione
    loading: statoCaricamento, // Manteniamo il nome originale per compatibilità
    error: erroreCaricamento,

    // Funzioni principali
    toggleFavorite: commutaPreferito, // Manteniamo il nome originale per compatibilità
    getCoffeeById: ottieniCaffePerID, // Manteniamo il nome originale per compatibilità

    // Funzioni helper aggiuntive
    ottieniStatistichePreferiti,
    èNeiPreferiti,

    // Dati derivati utili
    numeroCaffeCaricati: tuttiICaffe.length,
    numeroPreferiti: preferiti.length,
    haErrori: !!erroreCaricamento,
    èInCaricamento: statoCaricamento,
  };
}
