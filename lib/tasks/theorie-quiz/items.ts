export interface QuizItem {
  id: string;
  cluster: string;
  question: string;
  options: string[];
  /** Index of the correct option in `options`. */
  correct: number;
  explanation: string;
}

/**
 * Static question bank. New items can be appended; do not change ids of
 * existing items (they are not used for routing but help debugging).
 */
export const QUIZ_BANK: readonly QuizItem[] = [
  {
    id: "fifo-steigend",
    cluster: "Verbrauchsfolge",
    question:
      "Bei steigenden Rohstoffpreisen führt FIFO (verglichen mit LIFO) tendenziell zu …",
    options: [
      "einem höheren Periodengewinn.",
      "einem niedrigeren Periodengewinn.",
      "demselben Periodengewinn.",
      "einem negativen Endbestand.",
    ],
    correct: 0,
    explanation:
      "FIFO verbraucht zuerst die alten, günstigeren Bestände. Die ausgewiesenen Verbrauchskosten sind niedriger als bei LIFO, daraus folgt ein höherer Periodengewinn.",
  },
  {
    id: "lifo-fallend",
    cluster: "Verbrauchsfolge",
    question:
      "Bei fallenden Rohstoffpreisen führt LIFO (verglichen mit FIFO) tendenziell zu …",
    options: [
      "einem höheren Periodengewinn.",
      "einem niedrigeren Periodengewinn.",
      "demselben Periodengewinn.",
      "einem negativen Endbestand.",
    ],
    correct: 0,
    explanation:
      "LIFO bewertet den Verbrauch mit den jüngsten (jetzt günstigeren) Preisen, daher sind die Verbrauchskosten niedriger als bei FIFO und der Periodengewinn höher.",
  },
  {
    id: "kostenverlauf-wurzel",
    cluster: "Kostenverlauf",
    question:
      "Welcher Kostenverlauf liegt bei K(x) = a·√x + Kf für große x vor?",
    options: [
      "Linear.",
      "Progressiv (überproportional).",
      "Degressiv (unterproportional).",
      "S-förmig.",
    ],
    correct: 2,
    explanation:
      "Die Grenzkosten K'(x) = a/(2√x) sind streng monoton fallend, jeder zusätzliche Output kostet weniger – damit liegt ein degressiver (unterproportionaler) Verlauf vor.",
  },
  {
    id: "afa-erstjahr",
    cluster: "Abschreibung",
    question:
      "Welches Abschreibungsverfahren maximiert ceteris paribus den Periodengewinn im 1. Jahr (geringe Anfangsleistung vorausgesetzt)?",
    options: [
      "Linear.",
      "Geometrisch-degressiv.",
      "Arithmetisch-degressiv.",
      "Leistungsabhängig (bei geringer Anfangsleistung).",
    ],
    correct: 3,
    explanation:
      "Bei leistungsabhängiger Abschreibung mit geringer Anfangsleistung ist der AfA-Betrag im ersten Jahr besonders niedrig – der Periodengewinn wird damit am wenigsten belastet.",
  },
  {
    id: "treppe-exakt",
    cluster: "ILV-Treppe",
    question: "Wann ist die Treppenumlage exakt?",
    options: [
      "Wenn alle Vorkostenstellen denselben Verrechnungspreis haben.",
      "Wenn Leistungen zwischen Vorkostenstellen nur in eine Richtung fließen.",
      "Wenn keine Endkostenstellen existieren.",
      "Wenn die Primärkosten null sind.",
    ],
    correct: 1,
    explanation:
      'Die Treppe rechnet stufenweise nur „nach unten" ab. Das ist nur dann exakt, wenn keine Rückflüsse zwischen Vorkostenstellen existieren.',
  },
  {
    id: "fixkostendegression",
    cluster: "Fixkostendegression",
    question:
      "Bei steigender Produktionsmenge sinken bei konstanten Fixkosten die …",
    options: [
      "variablen Stückkosten.",
      "fixen Stückkosten.",
      "Grenzkosten.",
      "Erlöse pro Stück.",
    ],
    correct: 1,
    explanation:
      "Die Fixkosten verteilen sich auf mehr Stück, daher fallen die fixen Stückkosten (Fixkostendegression). Variable Stückkosten und Grenzkosten bleiben definitionsgemäß unbeeinflusst.",
  },
  {
    id: "gkv-ukv",
    cluster: "GKV vs. UKV",
    question:
      "Bei Lageraufbau ist der Gewinn bei Vollkostenrechnung im Vergleich zur Teilkostenrechnung …",
    options: ["niedriger.", "gleich hoch.", "höher.", "immer null."],
    correct: 2,
    explanation:
      "Bei Lageraufbau werden in der Vollkostenrechnung anteilige Fixkosten in den Bestand aktiviert und belasten die Periode nicht – der Gewinn ist daher höher als in der Teilkostenrechnung.",
  },
  {
    id: "kalk-zusatz",
    cluster: "Kalk. Kosten",
    question: "Kosten ohne korrespondierenden Aufwand heißen …",
    options: ["Anderskosten.", "Zusatzkosten.", "Grundkosten.", "Sondereinzelkosten."],
    correct: 1,
    explanation:
      "Zusatzkosten (z. B. kalkulatorischer Unternehmerlohn, kalk. Eigenkapitalzinsen) treten ohne entsprechenden Aufwand in der Finanzbuchhaltung auf.",
  },
  {
    id: "grenzkosten-def",
    cluster: "Grenzkosten",
    question: "Wie sind Grenzkosten korrekt definiert?",
    options: [
      "Durchschnittskosten der Periode.",
      "Erste Ableitung der Kostenfunktion bzw. Kosten der nächsten produzierten Einheit.",
      "Kosten der bisher höchsten Auslastung.",
      "Variable Kosten geteilt durch Fixkosten.",
    ],
    correct: 1,
    explanation:
      "Grenzkosten K'(x) sind die Kosten der nächsten infinitesimalen Mengeneinheit, formal die erste Ableitung der Kostenfunktion.",
  },
  {
    id: "pkr-spezial",
    cluster: "Prozesskostenrechnung",
    question:
      "Spezialprodukte werden bei Prozesskostenrechnung im Vergleich zur klassischen Zuschlagskalkulation tendenziell …",
    options: [
      "weniger stark belastet.",
      "stärker belastet (Allokationseffekt).",
      "gleich belastet.",
      "ohne Gemeinkosten ausgewiesen.",
    ],
    correct: 1,
    explanation:
      "Spezialprodukte verursachen viele Prozessauslösungen und werden daher in der PKR höher belastet als bei einer Zuschlagskalkulation, die proportional zu den Einzelkosten umlegt.",
  },
  {
    id: "make-or-buy",
    cluster: "Make-or-Buy",
    question:
      "Welche Kosten sind bei einer Make-or-Buy-Entscheidung entscheidungsrelevant?",
    options: [
      "Alle Voll- und Fixkosten der Eigenfertigung.",
      "Nur die abbaubaren Fixkosten und die variablen Kosten.",
      "Ausschließlich die kalkulatorischen Kosten.",
      "Alle Kosten der Verwaltung.",
    ],
    correct: 1,
    explanation:
      "Sunk Costs (nicht abbaubare Fixkosten) sind nicht entscheidungsrelevant. Relevant sind nur die variablen Kosten und die abbaubaren Fixkosten.",
  },
  {
    id: "sicherheitskoeff",
    cluster: "Break-Even",
    question: "Was misst der Sicherheitskoeffizient?",
    options: [
      "Den Anteil der Fixkosten am Umsatz.",
      "Den Abstand zwischen erwartetem Absatz und Break-Even-Menge in % vom Absatz.",
      "Den Anteil des Deckungsbeitrags am Stückpreis.",
      "Den Zielgewinn in % der Fixkosten.",
    ],
    correct: 1,
    explanation:
      "Der Sicherheitskoeffizient = (Plan-Absatz − x_b) / Plan-Absatz · 100 % gibt an, wie weit der erwartete Absatz oberhalb der Gewinnschwelle liegt.",
  },
  {
    id: "anders-vs-zusatz",
    cluster: "Kalk. Kosten",
    question: "Was sind Anderskosten?",
    options: [
      "Kosten ohne Aufwand.",
      "Kosten in anderer Höhe als der entsprechende Aufwand.",
      "Aufwand ohne Kosten.",
      "Steuern und Abgaben.",
    ],
    correct: 1,
    explanation:
      "Typisches Beispiel: Kalkulatorische Abschreibung weicht vom bilanziellen Aufwand ab – sie ist daher Anderskosten.",
  },
  {
    id: "gleichungsverfahren",
    cluster: "ILV-Gleichung",
    question:
      "Wie viele Gleichungen werden mindestens benötigt, um die Verrechnungspreise von n Vorkostenstellen exakt zu bestimmen?",
    options: ["1", "n − 1", "n", "n²"],
    correct: 2,
    explanation:
      "Pro Vorkostenstelle eine Gleichung – das LGS hat n Unbekannte und n Gleichungen.",
  },
  {
    id: "deckungsbeitrag",
    cluster: "Deckungsbeitragsrechnung",
    question: "Der Stückdeckungsbeitrag d ist …",
    options: [
      "Selbstkosten je Stück.",
      "Differenz aus Verkaufspreis und variablen Stückkosten (p − k_v).",
      "Differenz aus Verkaufspreis und Vollkosten je Stück.",
      "Differenz aus Erlös und Fixkosten.",
    ],
    correct: 1,
    explanation:
      "d = p − k_v misst, wie viel jede zusätzlich verkaufte Einheit zur Deckung der Fixkosten und zum Gewinn beiträgt.",
  },
  {
    id: "programmtyp-sortenfertigung",
    cluster: "Kalkulationsverfahren",
    question:
      "Ein Unternehmen fertigt Pralinen in großen Stückzahlen homogener, artverwandter Produkte in verschiedenen Verpackungsgrößen. Welcher Programmtyp und welches Kalkulationsverfahren liegen vor?",
    options: [
      "Einzelfertigung; Zuschlagskalkulation.",
      "Sortenfertigung; Äquivalenzziffern- bzw. Divisionskalkulation.",
      "Serienfertigung; differenzierte Zuschlagskalkulation.",
      "Massenfertigung eines einzigen Produkts; einfache Divisionskalkulation.",
    ],
    correct: 1,
    explanation:
      "Artverwandte Produkte in verschiedenen Größen sind klassische Sortenfertigung – die Stückkosten werden über Äquivalenzziffern (oder mehrstufige Division) bestimmt. Einzelfertigung wäre z. B. Tankerbau oder Maßkleidung und würde Zuschlagskalkulation erfordern.",
  },
  {
    id: "fifo-steigend-erfolg",
    cluster: "Verbrauchsfolge",
    question:
      "Die Preise des zentralen Rohstoffs sind im letzten Jahr stark gestiegen. Welches Verbrauchsfolgeverfahren führt in dieser Situation zu einem höheren Periodenerfolg?",
    options: ["FIFO.", "LIFO.", "Beide Verfahren liefern denselben Erfolg.", "HIFO."],
    correct: 0,
    explanation:
      "Bei FIFO werden die älteren, billigeren Bestände als verbraucht gebucht – die Materialkosten sind niedriger und der Periodenerfolg höher. LIFO bewertet den Verbrauch mit den jüngsten, teureren Preisen und schmälert den Gewinn.",
  },
  {
    id: "kostenfunktion-ableitung",
    cluster: "Kostenverlauf",
    question:
      "Welchen Kosten entspricht die erste Ableitung der Kostenfunktion C′(x), und welcher Kostenverlauf liegt bei C(x) = √x + 100.000 (für x ≥ 1) vor?",
    options: [
      "Durchschnittskosten; linear.",
      "Grenzkosten; unterproportional (degressiv).",
      "Grenzkosten; überproportional (progressiv).",
      "Fixkosten; konstant.",
    ],
    correct: 1,
    explanation:
      "C′(x) sind Grenzkosten. Hier ist C′(x) = 1 / (2√x), für x ≥ 1 streng monoton fallend und kleiner 1 – ein degressiver (unterproportionaler) Kostenverlauf.",
  },
  {
    id: "vollkosten-fehlanreiz",
    cluster: "GKV vs. UKV",
    question:
      "Warum kann das Gesamtkostenverfahren auf Vollkostenbasis Fehlanreize für das Management setzen?",
    options: [
      "Weil variable Kosten doppelt verrechnet werden.",
      "Weil reine Überproduktion (Lageraufbau) den ausgewiesenen Gewinn künstlich steigert, da fixe Gemeinkosten im Bestand aktiviert werden.",
      "Weil Vertriebskosten nicht erfasst werden.",
      "Weil Erlöse erst bei Zahlungseingang verbucht werden.",
    ],
    correct: 1,
    explanation:
      "Bei Vollkostenrechnung werden Fixkosten anteilig im Lagerbestand aktiviert. Ein Manager kann durch Überproduktion (Einlagerung) Fixkosten in den Bestand verschieben und so den Periodengewinn künstlich erhöhen – ein klarer Fehlanreiz.",
  },
  {
    id: "unternehmerlohn-zuordnung",
    cluster: "Wertabgrenzung",
    question:
      "Ein Einzelunternehmer investiert Arbeitszeit, die nicht explizit vergütet wird. Wie ist dieser Sachverhalt einzuordnen?",
    options: [
      "Aufwand und Auszahlung.",
      "Kosten und Aufwand.",
      "Ausschließlich Kosten (kalkulatorischer Unternehmerlohn).",
      "Ausschließlich Auszahlung.",
    ],
    correct: 2,
    explanation:
      "Da keine tatsächliche Zahlung und keine Buchung in der Finanzbuchhaltung erfolgt, liegen weder Auszahlung noch Aufwand vor. Der bewertete Eigenleistungsverzehr ist jedoch betriebsbedingter Werteverbrauch und damit kalkulatorischer Unternehmerlohn – also Zusatzkosten.",
  },
  {
    id: "herstellkosten-selbstkosten",
    cluster: "Kalkulation",
    question:
      "Wahr oder falsch? – „Die Herstellkosten sind ein Bestandteil der Selbstkosten.\"",
    options: [
      "Wahr.",
      "Falsch – Selbstkosten sind ein Bestandteil der Herstellkosten.",
      "Wahr, aber nur bei Eigenfertigung.",
      "Falsch – beide Begriffe sind identisch.",
    ],
    correct: 0,
    explanation:
      "Selbstkosten = Herstellkosten + Verwaltungs- und Vertriebsgemeinkosten (ggf. Sondereinzelkosten des Vertriebs). Die Herstellkosten sind also ein Bestandteil der Selbstkosten, nicht umgekehrt.",
  },
  {
    id: "afa-letzte-periode-intensiv",
    cluster: "Abschreibung",
    question:
      "Eine Maschine wird im Zeitverlauf von Periode zu Periode immer intensiver genutzt. Mit welcher Abschreibungsmethode ist der Periodenerfolg in der letzten Periode am geringsten?",
    options: [
      "Lineare Abschreibung.",
      "Geometrisch-degressive Abschreibung.",
      "Arithmetisch-degressive Abschreibung.",
      "Leistungsabhängige Abschreibung.",
    ],
    correct: 3,
    explanation:
      "Bei leistungsabhängiger Abschreibung folgt der AfA-Betrag der tatsächlichen Nutzung. Da die Anlage am Ende am stärksten genutzt wird, ist der Abschreibungsbetrag in der letzten Periode am höchsten und drückt den Periodenerfolg dort am stärksten.",
  },
  {
    id: "afa-nutzungsdauer-25prozent",
    cluster: "Abschreibung",
    question:
      "Eine Anlage (AHK 278.000 €, Restbuchwert 16.500 €) wird so abgeschrieben, dass jährlich 25 % des gesamten abzuschreibenden Betrags abgesetzt werden. Wie lang ist die Nutzungsdauer?",
    options: ["3 Jahre.", "4 Jahre.", "5 Jahre.", "8 Jahre."],
    correct: 1,
    explanation:
      "Werden pro Jahr 25 % des abzuschreibenden Betrags verbucht, ergibt sich eine Nutzungsdauer von 100 % / 25 % = 4 Jahren – unabhängig von AHK und Restwert.",
  },
  {
    id: "bab-zuordnung",
    cluster: "Kostenstellenrechnung",
    question:
      "Wahr oder falsch? – „Die Verteilung primärer Gemeinkosten im Betriebsabrechnungsbogen gehört zur Kostenträgerrechnung.\"",
    options: [
      "Wahr.",
      "Falsch – sie gehört zur Kostenartenrechnung.",
      "Falsch – sie gehört zur Kostenstellenrechnung.",
      "Wahr, sofern Hilfskostenstellen existieren.",
    ],
    correct: 2,
    explanation:
      "Der BAB verteilt primäre Gemeinkosten auf Kostenstellen und ist damit das zentrale Werkzeug der Kostenstellenrechnung. Die Kostenträgerrechnung folgt erst danach (Kalkulation).",
  },
  {
    id: "block-exakt",
    cluster: "ILV-Block",
    question:
      "Welche Bedingung muss erfüllt sein, damit das Blockumlageverfahren ein exaktes Ergebnis liefert?",
    options: [
      "Alle Vorkostenstellen müssen denselben Verrechnungspreis haben.",
      "Es dürfen keine Leistungsbeziehungen zwischen Vorkostenstellen bestehen (nur Lieferungen an Endkostenstellen).",
      "Leistungsbeziehungen zwischen Vorkostenstellen dürfen nur in eine Richtung fließen.",
      "Die Primärkosten müssen gleich verteilt sein.",
    ],
    correct: 1,
    explanation:
      "Die Blockumlage ignoriert wechselseitige Leistungen vollständig. Sie ist nur dann exakt, wenn die Vorkostenstellen ausschließlich an Endkostenstellen leisten und keine internen Verflechtungen bestehen.",
  },
  {
    id: "treppe-vs-gleichung",
    cluster: "ILV-Vergleich",
    question:
      "Warum ist das Treppenumlageverfahren weniger genau als das Gleichungsverfahren?",
    options: [
      "Weil die Treppe Primärkosten ignoriert.",
      "Weil die Treppe wechselseitige (rückwirkende) Leistungsbeziehungen nicht abbilden kann; das Gleichungsverfahren löst alle Ströme simultan und ist immer exakt.",
      "Weil das Gleichungsverfahren Fixkosten ausblendet.",
      "Weil die Treppe nur bei zwei Vorkostenstellen funktioniert.",
    ],
    correct: 1,
    explanation:
      "Die Treppe rechnet stufenweise von oben nach unten ab und kann Rückflüsse zwischen Vorkostenstellen nicht erfassen. Das Gleichungsverfahren löst ein lineares Gleichungssystem über alle Verflechtungen simultan und liefert daher unter allen Verfahren immer das exakte Ergebnis.",
  },
  {
    id: "aequivalenz-tonrohre-volumen",
    cluster: "Äquivalenzziffer",
    question:
      "Warum ist es bei der Äquivalenzziffernrechnung für Tonrohre ökonomisch sinnvoll, das Produkt aus Durchmesser und Länge anstatt nur einer der beiden Größen als Bezugsbasis zu verwenden?",
    options: [
      "Weil dadurch die Fixkosten verursachungsgerecht verteilt werden.",
      "Weil das Produkt das Volumen widerspiegelt und damit den proportionalen Materialverbrauch je Rohr.",
      "Weil dadurch der Verkaufspreis abgebildet wird.",
      "Weil so die Maschinenlaufzeit gemessen wird.",
    ],
    correct: 1,
    explanation:
      "Materialeinsatz und damit die wesentlichen variablen Kosten skalieren mit dem Volumen der Rohre. Durchmesser × Länge ist ein guter Volumen-Proxy und liefert deshalb verursachungsgerechte Äquivalenzziffern.",
  },
  {
    id: "break-even-gewinn-null",
    cluster: "Break-Even",
    question:
      "Wahr oder falsch? – „Im Break-Even-Punkt ist der Gewinn genau null.\"",
    options: [
      "Wahr – Umsatz deckt genau die fixen und variablen Kosten.",
      "Falsch – im Break-Even-Punkt ist der Gewinn maximal.",
      "Falsch – im Break-Even-Punkt deckt der Deckungsbeitrag nur die variablen Kosten.",
      "Wahr – nur in der Vollkostenrechnung, nicht in der Teilkostenrechnung.",
    ],
    correct: 0,
    explanation:
      "Der Break-Even-Punkt ist definiert als die Menge, bei der der Gesamtdeckungsbeitrag genau die Fixkosten deckt: Umsatz = Gesamtkosten, also Gewinn = 0. Erst oberhalb dieser Menge entstehen Gewinne.",
  },
];
