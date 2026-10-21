/*
 * Regressiotesti: index.html:n laskentalogiikan on vastattava solu solulta
 * alkuperäistä laskentataulukkoa GoogleSpreadSheet/Bonuspisteiden_laskentamalli.xlsx.
 *
 * Aja:  node tests/formulas.test.js
 * Ei riippuvuuksia – laskentakoodi luetaan suoraan index.html:stä.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = /<script>([\s\S]*)<\/script>/.exec(html);
if (!script) throw new Error('index.html: <script>-lohkoa ei löytynyt');

const src = script[1];
const from = src.indexOf('var $ = function(id)');
const to = src.indexOf('/* ===================== taulukko: ansaitseminen');
if (from < 0 || to < 0) throw new Error('index.html: laskentalohkon rajamerkkejä ei löytynyt');

global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
const m = eval(src.slice(from, to) + `
;({xround, pointValue, benefit, pointPrice, earnedPoints, timelineRows, totals, state})`);

let pass = 0, fail = 0;
function eq(cell, got, want, tol) {
  const ok = Math.abs(got - want) <= (tol || 1e-9);
  ok ? pass++ : fail++;
  console.log((ok ? '  ok  ' : 'FAIL  ') + cell + '  got=' + got + ' want=' + want);
}

/* Malli!B11:B13 – johdetut arvot */
eq('Malli!B11 pisteen arvo', m.pointValue(), 0.01);
eq('Malli!B12 asiakkaan etu', m.benefit(), 0.03);
eq('Malli!B13 pistehinnan kerroin', m.state.ppe, 100);

/* Malli!B17:C20 – ansaitseminen */
[[30, 90, 0.90], [75, 225, 2.25], [100, 300, 3.00], [300, 900, 9.00]].forEach(([eur, pts, worth]) => {
  eq('Malli ansainta ' + eur + ' € → pisteet', m.earnedPoints(eur), pts);
  eq('Malli ansainta ' + eur + ' € → arvo', m.earnedPoints(eur) * m.pointValue(), worth);
});

/* Malli!C24:D26 – tuotteiden pistehinnat */
[[10, 1000, 333.3333333], [20, 2000, 666.6666667], [50, 5000, 1666.666667]].forEach(([price, pp, need]) => {
  eq('Malli pistehinta ' + price + ' €', m.pointPrice(price), pp);
  eq('Malli ostoja tarvitaan ' + price + ' €', m.pointPrice(price) / m.state.multiplier, need, 1e-5);
});

/* Malli!D31:E35 – esimerkkiasiakas */
const rows = m.timelineRows();
const pts = [500, 60, 225, 690, -1000], bal = [500, 560, 785, 1475, 475];
rows.forEach((r, i) => {
  eq('Malli!D' + (31 + i) + ' pisteet', r.pts, pts[i]);
  eq('Malli!E' + (31 + i) + ' saldo', r.balance, bal[i]);
});

/* Malli!B37:B39 – yhteenveto */
const t = m.totals(rows);
eq('Malli!B37 maksettu yhteensä', t.paid, 325);
eq('Malli!B38 pisteillä saatu etu', t.gain, 10);
eq('Malli!B39 etu suhteessa ostoihin', t.benefit, 0.03076923077);

/* Tasot!B5, B8:E10 */
const exPP = m.pointPrice(m.state.examplePrice);
eq('Tasot!B5 esimerkkituotteen pistehinta', exPP, 5000);
[[3, 0.03, 225, 1666.666667], [4, 0.04, 300, 1250], [5, 0.05, 375, 1000]].forEach(([mult, ben, earn, reach], i) => {
  eq('Tasot!C' + (8 + i) + ' etu', mult / m.state.ppe, ben, 1e-12);
  eq('Tasot!D' + (8 + i) + ' keskiostos kerryttää', m.xround(m.state.avgOrder * mult, 0), earn);
  eq('Tasot!E' + (8 + i) + ' saavutetaan ostoilla', exPP / mult, reach, 1e-5);
});

/* Excelin PYÖRISTÄ: puolikkaat nollasta poispäin (Math.round pyöristäisi -2.5 → -2) */
eq('PYÖRISTÄ(2,5; 0)', m.xround(2.5, 0), 3);
eq('PYÖRISTÄ(-2,5; 0)', m.xround(-2.5, 0), -3);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
