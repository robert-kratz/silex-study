# Tutorium 9 – Mehrstufige Deckungsbeitragsrechnung (Direct Costing)

## 9.1 Mehrstufige Deckungsbeitragsrechnung

### Konzept
Stufenweiser Abzug fixer Kostenblöcke entsprechend ihrer Zurechenbarkeit (Produkt → Produktgruppe → Sparte → Unternehmen). Daraus Sortimentsentscheidungen ableiten.

### Formeln
- $DB^I = \text{Erlöse} - K_{var}$
- $DB^{II} = DB^I - K_{fix}^{produkt}$
- $DB^{III} = DB^{II} - K_{fix}^{produktgruppe}$
- $DB^{IV} = DB^{III} - K_{fix}^{sparte}$
- $\text{Betriebserfolg} = \sum DB^{n} - K_{fix}^{Unternehmen}$

### Generator
Baumstruktur:
- Unternehmen
  - Sparte 1 (z. B. Damen)
    - Produktgruppe 1A
      - Produkt 1A.x
      - Produkt 1A.y
    - Produktgruppe 1B
  - Sparte 2

Pro Blatt: Preis, Menge, $k_{var}$.
Pro Knoten (Produkt/Produktgruppe/Sparte/Unternehmen): zufällige Fixkosten-Blöcke.

**Wichtig für Theorie-Folgefrage**: erzwinge mit Wahrscheinlichkeit ~30 % ein Produkt mit **negativem DB I** (d. h. $p < k_{var}$) → der Spieler muss erkennen, dass dieses Produkt sofort entfernt werden sollte.

### UI
Hierarchische Tabelle (Tree Table). Pro Zeile: Erlös, $K_{var}$, $DB^I$, $K_{fix}^{Stufe}$, $DB^{Stufe}$. Eingabefelder pro Stufe.

### Auto-Check
- Pro Zeile/Stufe ±0,01 €.
- Folgefrage (Sortimentsentscheidung): Radio-Button „Welches Produkt sofort eliminieren?"
  - Korrekt: Produkt mit $DB^I < 0$.
  - Falls keines existiert: Option „Keines" muss korrekt sein.

---

## Implementierungs-Notiz

Datentyp Baum:
```ts
type Node = {
  id: string;
  name: string;
  level: 'unternehmen'|'sparte'|'produktgruppe'|'produkt';
  fixKosten?: number; // ab Sparte aufwärts
  blatt?: { preis: number; menge: number; kVar: number; produktFix?: number };
  children?: Node[];
};
```
Solver: rekursiv DB pro Knoten aggregieren.
