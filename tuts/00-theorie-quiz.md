# Aufgabentyp 0 – Theorie- & Konzept-Quiz

Übergreifender Aufgabentyp, der Definitionen, Wirkungsketten und Verfahrensvoraussetzungen abprüft. In der Klausur (FSS 2022) machte dieser Block ~25 % der Punkte aus, daher zwingender Bestandteil.

## 0.1 Multiple-Choice / Wahr-Falsch / Lückentext

### Konzept
Reine Verständnisprüfung ohne Rechnung. Frageformate:
- **Multiple Choice** (1 aus 4)
- **True/False** mit Pflicht-Begründung (Auswahl aus Erklärungen)
- **Lückentext** mit Dropdown (z. B. „steigend / fallend", „höher / niedriger")

### Themen-Cluster (mit Beispiel-Templates)

| Cluster | Beispielfrage (mit randomisierten Slots) | Korrekte Logik |
| --- | --- | --- |
| Verbrauchsfolge | „Bei {steigend\|fallend}en Rohstoffpreisen führt {FIFO\|LIFO} zu einem {höheren\|niedrigeren} Periodengewinn." | FIFO bei steigenden Preisen → niedrigere COGS → höherer Gewinn. |
| Kostenverlauf | „Gegeben $K(x) = a\sqrt{x} + K_f$. Welcher Verlauf liegt vor?" | Unterproportional, da $K' < 1$ für große $x$. |
| Abschreibung | „Welches Verfahren maximiert den Gewinn in Periode 1?" | Lineare oder leistungsabhängig (bei geringer Anfangsleistung). |
| ILV-Treppe | „Wann ist die Treppenumlage exakt?" | Wenn Leistungen nur in eine Richtung fließen. |
| Fixkostendegression | „Bei steigender Produktionsmenge sinken die ___ pro Stück." | Fixe Stückkosten. |
| GKV vs. UKV | „Bei Lageraufbau ist der Gewinn bei Vollkostenrechnung ___ als bei Teilkostenrechnung." | Höher (Fixkosten in Bestand aktiviert). |
| Kalk. Kosten | „Kosten ohne Aufwand heißen ___." | Zusatzkosten. |
| Grenzkosten | „Grenzkosten = ___." | Erste Ableitung der Kostenfunktion / Kosten der nächsten Einheit. |
| Prozesskostenrechnung | „Spezialprodukte werden bei PKR im Vergleich zur Zuschlagskalkulation tendenziell ___." | Stärker belastet (Allokationseffekt). |
| Make-or-Buy | „Welche Kosten sind entscheidungsrelevant?" | Nur abbaubare Fixkosten + variable Kosten. |
| Break-Even | „Sicherheitskoeffizient misst ___." | Abstand erwarteter Absatz – Break-Even-Menge in % vom Absatz. |

## Generator-Plan

Frage-Datenbank als JSON-Array:
```ts
type QuizItem = {
  id: string;
  cluster: string;
  template: string;            // mit {slotA|slotB} Platzhaltern
  slots: Record<string, string[]>;
  resolveAnswer: (chosenSlots: Record<string,string>) => string; // Berechnet Korrektantwort dynamisch
  options: (chosenSlots: Record<string,string>) => string[];     // 4 Antworten
  explanation: (chosenSlots: Record<string,string>, correct: string) => string;
};
```
- Generator wählt zufälliges Item, würfelt Slots, baut Frage + 4 Antwortoptionen (1 korrekt, 3 plausible Distraktoren).
- Distraktoren stammen aus einer pro Cluster gepflegten Liste.

## UI

- shadcn `RadioGroup` für MC, `Switch`/`Toggle` für True/False, `Select` für Lückentext.
- Nach Submit: rote/grüne Färbung, Erklärung in `Alert`.
- „Nächste Frage"-Button erzeugt neuen Seed.

## Auto-Check

- 1 Punkt pro Frage, kein Teilpunkt.
- Erklärungstext immer einblenden – auch bei richtiger Antwort (Lerneffekt).
- Pro Session 5–10 zufällige Items aus gemischten Clustern.

## Integration in andere Aufgabentypen

Jeder Rechen-Aufgabentyp endet optional mit 1 Theorie-Folgefrage aus passendem Cluster (z. B. nach Typ 3.2 → FIFO/LIFO-Cluster, nach Typ 4.3 → ILV-Treppe-Cluster).
