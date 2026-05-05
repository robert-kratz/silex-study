# Tutorium 10 – Break-Even-Analyse

## 10.1 Einprodukt-Break-Even & Zielgewinn

### Konzept
Menge ermitteln, bei der Erlöse = Gesamtkosten (Gewinn = 0); analog für Zielgewinn.

### Formeln
- Stückdeckungsbeitrag $d = p - k_v$
- Break-Even-Menge $x_b = K_f / d$
- Menge für Zielgewinn $ZG$: $x_{ZG} = (K_f + ZG)/d$
- Break-Even-Umsatz: $U_b = x_b \cdot p$

### Generator
- $p \in [10, 200]$, $k_v \in [0{,}3p, 0{,}7p]$, $K_f \in [10\,000, 200\,000]$, $ZG \in [5\,000, 100\,000]$.
- Werte so wählen, dass $x_b$ ganzzahlig oder mit ≤2 Nachkommastellen ist.

### UI / Check
3 Eingabefelder: $d$, $x_b$, $x_{ZG}$. Toleranz ±0,5 oder ±0,01 €. Optional 4. Feld: $U_b$.

---

## 10.2 Sensitivitätsanalyse & Sicherheitskoeffizient

### Konzept
Wie verändert sich der Gewinn, wenn Fixkosten oder Preis steigen? Wie groß ist der Puffer bis zum Break-Even?

### Formeln
- $S = \dfrac{x_e - x_b}{x_e}$ (in %; $x_e$ = erwarteter Absatz)
- Effekt einer Werbemaßnahme: $\Delta G = d \cdot \Delta x - \Delta K_f$
- Effekt einer Preisänderung: $\Delta G = (\Delta p)\cdot x_e + (p - k_v) \cdot \Delta x$ etc. (je nach Szenario).

### Generator
- Basisdaten aus 10.1.
- Erwarteter Absatz $x_e \in [1{,}3 x_b, 2{,}5 x_b]$.
- Szenario: „Werbung erhöht $K_f$ um $\Delta K_f$ und Absatz um $\Delta x$ (in % oder absolut)."

### UI / Check
- Eingabe: $S$ in % (±0,1 Prozentpunkte).
- Eingabe: $\Delta G$ (±0,01 €).
- MC: „Sollte die Werbemaßnahme durchgeführt werden?" (basiert auf Vorzeichen von $\Delta G$).

---

## 10.3 Mehrprodukt-Break-Even (festes Verkaufsverhältnis)

### Konzept
Bei zwei Produkten und konstantem Mengenverhältnis $v = x_1/x_2$ wird ein eindeutiger Break-Even-Punkt im Mengenraum bestimmt.

### Formeln
$x_b^{(1)} = \dfrac{K_f}{d_1 + d_2 / v}$, $x_b^{(2)} = x_b^{(1)} / v$

(alternativ via aggregiertem Stückdeckungsbeitrag des Verkaufspakets)

### Generator
- 2 Produkte mit Preis und $k_v$.
- Gemeinsame Fixkosten.
- Festes Verhältnis $v\in\{0{,}5, 1, 2, 3\}$.

### UI / Check
- Zwei numerische Felder: $x_b^{(1)}, x_b^{(2)}$.
- Toleranz ±0,5 Stück (oder ±0,01 bei Dezimalwerten).
- Folgefrage: „Welches Produkt müsste mehr verkauft werden, um die gleiche Anzahl Pakete schneller zu erreichen?" (Theorie-Cluster).

---

## Implementierungs-Notiz

Klein und gut wiederverwendbar – ideale Aufgabe, um die Engine-Architektur als Erstes zu testen. Eine `breakEven.ts` mit:
```ts
function singleProduct(p, kv, Kf, zg?): { d, xb, xZg };
function safety(xe, xb): number;
function multiProduct(products, ratio, Kf): { x1, x2 };
```
