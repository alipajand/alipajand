# DisplayWord

The one uppercase page word, split into two halves around a spark, filling the frame edge to edge.

- Split at the first space, else at a camel-case join (Ledger·Guard, Tally·Folio). A single word pairs with a second word that is true for the page, such as the year or "Case study".
- Always give the `h1` an `aria-label` with the real name, since the visual split is decoration.
- On scroll the halves close toward the spark and the spark rotates. With reduced motion it stays still.
- Size is `11.6cqi` by default. `kit/fit.js` shrinks it whenever the two halves would run past the frame, so the word never clips. Case studies mark it `data-grow`, so it also scales up to fill the row.
