// Importazioni dalle librerie React per la gestione del contesto
import { createContext, useContext } from "react";

// Importazione del custom hook che contiene tutta la logica di business per i caffè
import { useCoffeeLogic } from "../hooks/useCoffeeLogic";

/**
 * Creazione del contesto React per la condivisione globale dei dati relativi ai caffè.
 * Questo contesto permette a tutti i componenti dell'applicazione di accedere
 * ai dati dei caffè, preferiti, e alle funzioni di gestione senza prop drilling.
 */
const ContestoCaffe = createContext();

/**
 * Provider del contesto dei caffè che wrappa l'intera applicazione o sezioni specifiche.
 * Utilizza un custom hook per centralizzare tutta la logica di business e fornisce
 * questi dati a tutti i componenti figli attraverso il sistema di contesto React.
 *
 * @component
 * @param {Object} props - Le proprietà del componente provider
 * @param {React.ReactNode} props.children - I componenti figli che avranno accesso al contesto
 * @returns {JSX.Element} Il provider del contesto con i figli wrappati
 */
export function ProviderCaffe({ children: componentiFigli }) {
  // Utilizzo del custom hook che gestisce tutta la logica dei caffè
  // Questo include stati, effetti, e funzioni per la gestione dei dati
  const logicaCaffe = useCoffeeLogic();

  return (
    // Il Provider rende disponibile la logica dei caffè a tutti i componenti figli
    <ContestoCaffe.Provider value={logicaCaffe}>
      {componentiFigli}
    </ContestoCaffe.Provider>
  );
}

/**
 * Hook personalizzato per accedere facilmente al contesto dei caffè.
 * Fornisce un'interfaccia sicura per utilizzare il contesto, con controllo
 * automatico che il hook sia utilizzato all'interno del Provider appropriato.
 *
 * @function
 * @returns {Object} L'oggetto contesto con tutti i dati e funzioni dei caffè
 * @throws {Error} Se utilizzato al di fuori di un ProviderCaffe
 */
export function usaCaffe() {
  // Recupera il valore corrente del contesto
  const contestoCorrente = useContext(ContestoCaffe);

  // Controllo di sicurezza per assicurarsi che il hook sia utilizzato correttamente
  if (!contestoCorrente) {
    throw new Error(
      "usaCaffe deve essere utilizzato esclusivamente all'interno di un ProviderCaffe. " +
        "Assicurati che il componente sia wrappato dal provider del contesto."
    );
  }

  // Restituisce il contesto se tutto è corretto
  return contestoCorrente;
}

/**
 * Esportazione di default del contesto per usi avanzati.
 * Generalmente non dovrebbe essere utilizzato direttamente, ma può essere utile
 * per test o casi d'uso specifici dove è necessario accesso diretto al contesto.
 */
export default ContestoCaffe;
