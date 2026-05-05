import { breakEvenTask } from "@/lib/tasks/break-even";
import { theorieQuizTask } from "@/lib/tasks/theorie-quiz";
import { tarifwahlTask } from "@/lib/tasks/tarifwahl";
import { wertabgrenzungTask } from "@/lib/tasks/wertabgrenzung";
import { preiskalkulationTask } from "@/lib/tasks/preiskalkulation";
import { gewinnmaximierungTask } from "@/lib/tasks/gewinnmaximierung";
import { wertabgrenzungDetailTask } from "@/lib/tasks/wertabgrenzung-detail";
import { linearerFitTask } from "@/lib/tasks/linearer-fit";
import { hochTiefTask } from "@/lib/tasks/hoch-tief";
import { makeOrBuyTask } from "@/lib/tasks/make-or-buy";
import { polynomGrenzkostenTask } from "@/lib/tasks/polynom-grenzkosten";
import { abschreibungsplanTask } from "@/lib/tasks/abschreibungsplan";
import { materialbewertungTask } from "@/lib/tasks/materialbewertung";
import { kalkZinsenTask } from "@/lib/tasks/kalk-zinsen";
import { babPrimaerTask } from "@/lib/tasks/bab-primaer";
import { ilvBlockTask } from "@/lib/tasks/ilv-block";
import { ilvTreppeTask } from "@/lib/tasks/ilv-treppe";
import { ilvGleichungTask } from "@/lib/tasks/ilv-gleichung";
import { ilvVergleichTask } from "@/lib/tasks/ilv-vergleich";
import { ilvTreppeOrderTask } from "@/lib/tasks/ilv-treppe-order";
import { divisionskalkulationTask } from "@/lib/tasks/divisionskalkulation";
import { ilvAufstellenTask } from "@/lib/tasks/ilv-aufstellen";
import { aequivalenzzifferTask } from "@/lib/tasks/aequivalenzziffer";
import { kuppelRestwertTask } from "@/lib/tasks/kuppel-restwert";
import { kuppelMarktwertTask } from "@/lib/tasks/kuppel-marktwert";
import { prozesskostenTask } from "@/lib/tasks/prozesskosten";
import { gutschriftLastschriftTask } from "@/lib/tasks/gutschrift-lastschrift";
import { gkvUkvTask } from "@/lib/tasks/gkv-ukv";
import { vollTeilkostenTask } from "@/lib/tasks/voll-teilkosten";
import { dbStufenrechnungTask } from "@/lib/tasks/db-stufenrechnung";
import { sensitivitaetTask } from "@/lib/tasks/sensitivitaet";
import { mehrproduktBeTask } from "@/lib/tasks/mehrprodukt-be";
import { differenzierteZuschlagskalkulationTask } from "@/lib/tasks/differenzierte-zuschlagskalkulation";
import { handelsrechtlicheHerstellkostenTask } from "@/lib/tasks/handelsrechtliche-herstellkosten";
import { kostenabweichungsanalyseTask } from "@/lib/tasks/kostenabweichungsanalyse";
import type { CourseDefinition } from "./types";

export const internesRechnungswesen: CourseDefinition = {
  id: "internes-rechnungswesen",
  title: "Internes Rechnungswesen",
  description:
    "Tutorien 1–10 inklusive Theorie-Quiz: Kostenfunktionen, Abschreibung, Kostenstellenrechnung, Kalkulation, Erfolgsrechnung, DBR und Break-Even.",
  tasks: [
    theorieQuizTask,
    tarifwahlTask,
    wertabgrenzungTask,
    preiskalkulationTask,
    gewinnmaximierungTask,
    wertabgrenzungDetailTask,
    linearerFitTask,
    hochTiefTask,
    makeOrBuyTask,
    polynomGrenzkostenTask,
    abschreibungsplanTask,
    materialbewertungTask,
    kalkZinsenTask,
    babPrimaerTask,
    ilvBlockTask,
    ilvTreppeTask,
    ilvGleichungTask,
    ilvVergleichTask,
    ilvTreppeOrderTask,
    differenzierteZuschlagskalkulationTask,
    handelsrechtlicheHerstellkostenTask,
    kostenabweichungsanalyseTask,
    divisionskalkulationTask,
    ilvAufstellenTask,
    aequivalenzzifferTask,
    kuppelRestwertTask,
    kuppelMarktwertTask,
    prozesskostenTask,
    gutschriftLastschriftTask,
    gkvUkvTask,
    vollTeilkostenTask,
    dbStufenrechnungTask,
    breakEvenTask,
    sensitivitaetTask,
    mehrproduktBeTask,
  ],
};
