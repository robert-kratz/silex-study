# Tutorium 1 – Grundbegriffe & Kostenfunktionen

## 1.1 Tarifwahl & Kostenvergleich

### Konzept
Drei Tarife (reine Flatrate, rein variabel, Misch) für unterschiedliche Nutzungsmengen vergleichen; günstigsten Tarif identifizieren und Durchschnittskosten ermitteln.

### Formeln
- Gesamtkosten: $K = K_{fix} + k_{var}\cdot x$
- Stückkosten: $k = K/x$

### Generator
- $\text{Tarif A}: K_{fix} \in [20,60]\,€,\; k_{var}=0$
- $\text{Tarif B}: K_{fix}=0,\; k_{var}\in[0{,}10,\,0{,}40]\,€$
- $\text{Tarif C}: K_{fix}\in[5,25]\,€,\; k_{var}\in[0{,}05,\,0{,}20]\,€$
- Drei Mengen $x_i \in \{50, 200, 500\}$ randomisiert ±20 %.

### Lösung
Pro Menge $K_A,K_B,K_C$ berechnen, Minimum bestimmen; $k_i = K_i/x$.

### UI / Eingabe
- Pro Menge: `Select` mit Tarif A/B/C
- Pro Menge optional: numerisches Feld für Stückkosten

### Auto-Check
- Tarif-Auswahl: 1 Punkt pro Menge.
- Stückkosten: ±0,01 €. Bei Gleichstand zweier Tarife beide akzeptieren.

---

## 1.2 Kategorisierung von Rechengrößen (Wertabgrenzung)

### Konzept
Geschäftsvorfälle in Spalten *Einzahlung / Auszahlung / Ertrag / Aufwand / Erlös / Kosten* einordnen.

### Definitionen
- **Auszahlung**: Abfluss liquider Mittel.
- **Aufwand**: Werteverzehr nach HGB.
- **Kosten**: bewerteter, sachzielorientierter Güterverbrauch (intern).
- **Zusatzkosten**: Kosten ohne Aufwand (z. B. kalk. Unternehmerlohn).
- **Anderskosten**: Kosten ≠ Aufwand (z. B. kalk. Abschreibung).

### Generator
Template-Datenbank mit jeweils Mapping auf die 6 Spalten:
```ts
type Vorfall = {
  text: string;            // mit {amount}-Platzhalter
  amountRange: [number, number];
  effects: Partial<Record<'einzahlung'|'auszahlung'|'ertrag'|'aufwand'|'erloes'|'kosten', number|((a:number)=>number)>>;
};
```
Beispiele:
- Rohstoffkauf bar: auszahlung=a, aufwand=a, kosten=a.
- Spende: auszahlung=a, aufwand=a, kosten=0.
- Kalk. Miete: kosten=a (Zusatzkosten), kein Aufwand, keine Auszahlung.

5–8 zufällige Vorfälle pro Aufgabe.

### Auto-Check
Matrix mit Eingabefeldern; leeres Feld = 0. Pro Zelle ±0,00 € (exakt). Teilpunkte pro korrekter Zelle.

---

## 1.3 Preiskalkulation (progressiv)

### Konzept
Vom Herstellkosten-Wert zum Listenverkaufspreis hochrechnen.

### Formeln
- Selbstkosten = Herstellkosten + VwGK + VtGK
- Gewinn = Selbstkosten · Gewinnaufschlag
- Barverkaufspreis = Selbstkosten + Gewinn
- Zielverkaufspreis = Barverkaufspreis / (1 − Skonto)
- Listenverkaufspreis = Zielverkaufspreis / (1 − Rabatt)

### Generator
- Herstellkosten $\in [10,100]\,€$
- VwGK %, VtGK %, Gewinnaufschlag %, Skonto % ($1\text{–}5\%$), Rabatt % ($5\text{–}15\%$).

### UI
Numerisches Eingabefeld für Listen-VK; optional Zwischenstufen als kollapsibarer Lösungsweg.

### Auto-Check
±0,02 € auf den finalen Preis.

---

## 1.4 Gewinnmaximierung mit Ableitungen

### Konzept
Gewinnmaximale Stückzahl bei Produktionsfunktion $f(x)=a\sqrt{x}$, Lohnsatz $w$ und Marktpreis $p$.

### Formeln
- $\pi(x) = p\cdot a\sqrt{x} - w\cdot x$
- $\pi'(x) = \frac{p\cdot a}{2\sqrt{x}} - w \stackrel{!}{=} 0 \Rightarrow x^* = \left(\frac{p\cdot a}{2w}\right)^2$

### Generator
- $a\in[5,20]$, $p\in[2,10]$, $w\in[0{,}5,3]$, gerundet so dass $x^*$ ganzzahlig ist (oder ±0,1).

### UI
Numerisches Feld für $x^*$, optional zweites Feld für maximalen Gewinn.

### Auto-Check
$x^*$ ±0,1; $\pi^*$ ±0,01.

---

## Implementierungs-Notizen

- Komponenten: `TarifChoice`, `WertabgrenzungMatrix`, `PreiskalkulationStepper`, `OptimumInput`.
- Pro Aufgabentyp eigene `generate.ts` + `solve.ts` + `check.ts`.
- KaTeX-Lernhilfen via shadcn `Sheet`/`Popover`.
