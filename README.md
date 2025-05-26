# Ottimizzazioni Prestazionali nei Componenti

## Memoizzazione Componenti

- `CoffeeCard` avvolto con `memo()` per evitare rerender non necessari
- `comparisonItems` in `CoffeeComparison` memorizzato con `useMemo`

## Ottimizzazione Chiamate API

- Dati dei caffè caricati una sola volta tramite context (`CoffeeContext`)
- Dettagli caffè caricati on demand in `CoffeeComparison`

## Gestione Stato Locale

- Stato separato per loading/errori nei componenti complessi
- Debounce implementato per la ricerca in `CoffeeList`

## Ottimizzazione Rendering

- List rendering con chiavi uniche in tutte le liste
- Conditional rendering per sezioni complesse (comparazioni)

## Ottimizzazione Immagini

- Lazy loading per immagini in `CoffeeComparison`
- Fallback a placeholder in caso di errore

## Gestione Eventi

- Stop propagation per eventi annidati (es. pulsante preferiti)
- Gestione efficiente degli eventi di tastiera

Le ottimizzazioni principali si concentrano sulla memoizzazione, gestione efficiente del rendering condizionale e ottimizzazione del data fetching.

---

# Flusso di Rendering della Lista dei Caffè

## Chiamata API iniziale (in useCoffeeLogic.jsx)

- Al mount del componente, parte `fetchCoffees()`
- Imposta `loading = true`
- Effettua chiamata GET a `${baseUrl}/coffees`
- Salva i dati in `coffees` con `setCoffees()`
- Imposta `loading = false`

## Passaggio dati via Context

- I dati vengono forniti a tutta l'app tramite `CoffeeProvider`
- Accessibili via `useCoffee()` in qualsiasi componente

## Rendering di CoffeeList

- Mostra spinner durante loading
- Quando i dati sono pronti:
  - Estrae le categorie uniche
  - Applica filtri (testo + categoria)
  - Ordina i risultati

## Ottimizzazioni durante il rendering

- Filtraggio lato client (non nuove chiamate API)
- Debounce 300ms per la ricerca
- Memoizzazione implicita con filter e sort

## Render lista finale

- Mappa i caffè filtrati in componenti `CoffeeCard`
- Ogni card è memoizzata (`memo()`) per evitare rerender inutili

## Aggiornamenti

- Toggle preferiti aggiorna solo lo stato locale
- Ricerca/filtri causano rerender ma senza nuove API calls
- Ordinamento gestito lato client

**Il flusso è: API call → Context update → Filtri/Optimizations → Render memoizzato**

---

# Flusso completo con l'Iterazione Utente e Gestione dei Preferiti

## Primo Render (Senza Dati)

- Mostra loading spinner (Caricamento della nostra selezione premium di caffè...)
- Parte la chiamata API in background

## Dopo il Fetch

```js
// useCoffeeLogic.jsx
setCoffees(response.data.coffees); // Dati salvati nel context
```

- Il componente `CoffeeList` riceve i dati aggiornati via `useCoffee()`
- Nasconde lo spinner e mostra la griglia di caffè

## Interazione Aggiunta Preferiti

### Click sull'icona in `CoffeeCard.jsx`

```jsx
onToggleFavorite(coffee.id); // Chiama la funzione del context
```

### Logica nel Context

```js
// useCoffeeLogic.jsx
const newFavorites = [...favorites, id]; // Aggiunge ID
localStorage.setItem("favoriteCoffees", JSON.stringify(newFavorites)); // Persistenza
setFavorites(newFavorites); // Aggiorna stato
```

### Feedback Visivo

- Icona passa da vuota (HeartOutline) a piena (HeartSolid)
- Il contatore in alto si aggiorna:

```jsx
<strong>{favorites.length}</strong> nei preferiti
```

## Rimozione Preferiti

- Stesso flusso, ma la logica inverte l'azione:

```js
// useCoffeeLogic.jsx
favorites.filter((favId) => favId !== id); // Rimuove ID
```

## Navigazione in `FavoritesList`

- Recupera solo i caffè con ID in `favorites`:

```jsx
// FavoritesList.jsx
coffees.filter((coffee) => favorites.includes(coffee.id));
```

- Se vuoto, mostra CTA con link alla lista completa

## Ottimizzazioni Chiave

- Memoizzazione: `CoffeeCard` usa `memo()` per evitare rerender
- LocalStorage: I preferiti persistono al refresh
- Propagation: `e.stopPropagation()` nell'handler del cuore evita conflitti con il click sulla card

## Esempio di Iterazione Completa

- Utente cerca "arabica" → Filtro applicato in tempo reale (con debounce)
- Aggiunge 2 caffè ai preferiti → Contatore sale a 2
- Clicca su "Preferiti" nella navbar → `FavoritesList` mostra solo i 2 selezionati
- Rimuove 1 preferito → La lista si aggiorna senza chiamate API

Tutte le interazioni sono gestite lato client dopo il fetch iniziale, con aggiornamenti immediati dello stato e della UI.

---

# Flusso Completo del `CoffeeComparison` con Iterazione Utente

## 1. Inizializzazione

- Componente mounta → Mostra due dropdown vuoti (-- Seleziona un caffè --)

### Chiamata API iniziale (`useCoffeeLogic.jsx`):

```js
// Carica tutti i caffè per popolare i dropdown
const response = await axios.get(`${baseUrl}/coffees`);
setCoffees(response.data.coffees);
```

## 2. Selezione Primo Caffè

Utente seleziona dal primo dropdown:

```jsx
// CoffeeComparison.jsx
<select onChange={(e) => handleCoffeeSelect("first", e.target.value)}>
  {coffees.map((coffee) => (
    <option value={coffee.id}>...</option>
  ))}
</select>
```

### Logica:

```js
const loadCoffeeDetails = async (id, position) => {
  setLoading({ ...loading, [position]: true }); // Mostra spinner
  const details = await getCoffeeById(id); // Chiamata API singolo caffè
  setSelectedCoffees([...]); // Aggiorna stato
};
```

### UI:

- Mostra spinner (Caricamento dettagli...)
- Dopo il fetch, mostra il nome del caffè selezionato nel dropdown

## 3. Selezione Secondo Caffè

- Stesso flusso del primo, ma per il secondo dropdown

### Stato finale:

```js
selectedCoffees = [ {id: 1, title: "Arabica"...}, {id: 2, title: "Robusta"...} ]
```

## 4. Render Confronto

Comparazione automatica quando entrambi i caffè sono caricati:

```jsx
// CoffeeComparison.jsx
{selectedCoffees[0] && selectedCoffees[1] && (
  <div className={styles.comparisonGrid}>
    {comparisonItems.map(item => {
      const result = getComparisonResult(coffeeA, coffeeB, item);
      return (...);
    })}
  </div>
)}
```

### Esempio logica di confronto:

```js
// Se confronta "acidità" (valore numerico)
if (item.isNumeric) {
  if (numA > numB) return "higher"; // Icona freccia su ↑
  if (numA < numB) return "lower"; // Icona freccia giù ↓
}
```

## 5. Interazioni Utente

### Reset:

```jsx
<button onClick={resetComparison}>Azzera</button>
```

- Resetta `selectedCoffees` a `[null, null]`

### Cambio selezione:

- Se l'utente cambia un dropdown, ricarica i dettagli con `loadCoffeeDetails()`

## 6. Ottimizzazioni Chiave

- `comparisonItems` è memorizzato con `useMemo(...)`
- Lazy loading immagini:

```jsx
<img loading="lazy" ... />
```

- Gestione errori: mostra messaggi se il fetch fallisce

## Esempio di Iterazione Completa

- Utente seleziona "Arabica" nel primo dropdown → API call → Mostra dettagli
- Seleziona "Robusta" nel secondo dropdown → API call → Confronto auto-renderizzato
- Vede differenze visive (es.: ↑ acidità, ↓ corpo, = prezzo)
- Clicca "Azzera" → Torna alla selezione iniziale

Tutte le chiamate API sono on-demand (tranne il fetch iniziale della lista), con stati gestiti in modo isolato per evitare rerender non necessari.
