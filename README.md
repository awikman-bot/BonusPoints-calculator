# Bonuspisteiden laskentamalli

Interaktiivinen verkkosovellus, joka toistaa Google Sheets -laskentamallin
**Bonuspisteiden laskentamalli** (Altaalle.com) kaavat selaimessa.

**Sovellus:** <https://awikman-bot.github.io/BonusPoints-calculator/>

## Mitä se tekee

Mallilla mitoitetaan verkkokaupan kanta-asiakasohjelma: montako pistettä eurosta
kertyy, mitä piste on arvoltaan, mitä tuotteet maksavat pisteinä ja paljonko
asiakas hyötyy vuoden aikana.

| Välilehti | Sisältö |
|---|---|
| **Malli** | Säännöt, ansaintataulukko, tuotteiden pistehinnat ja esimerkkiasiakkaan aikajana |
| **Tasot** | Tasovertailu – vain ansaitsemiskerroin muuttuu, pistehinnat pysyvät samoina |
| **Ohje** | Kolme sääntöä, Vilkkaan laskentalogiikka ja värikoodit |

Kaikki taulukot ovat muokattavia: rivejä voi lisätä ja poistaa, ja arvot
lasketaan uudelleen välittömästi. Syötteet tallentuvat selaimen
`localStorage`-muistiin; **Oletukset**-painike palauttaa alkuperäisen mallin arvot.

## Kaavat

Kaavat vastaavat solu solulta alkuperäistä laskentataulukkoa:

```
pisteen arvo           = 1 ÷ pisteitä per euro
asiakkaan etu (%)      = ansaitsemiskerroin ÷ pisteitä per euro
ansaitut pisteet       = PYÖRISTÄ(ostos × ansaitsemiskerroin; 0)
pistehinta             = PYÖRISTÄ(hinta × pisteitä per euro; 0)
ostoja tarvitaan       = pistehinta ÷ ansaitsemiskerroin
etu suhteessa ostoihin = pisteillä saatu etu ÷ maksettu yhteensä
```

Pyöristys noudattaa Excelin `PYÖRISTÄ`-semantiikkaa (puolikkaat nollasta
poispäin), ei JavaScriptin `Math.round`-oletusta.

## Rakenne

```
index.html                 koko sovellus – ei riippuvuuksia, ei käännösvaihetta
GoogleSpreadSheet/         alkuperäinen laskentataulukko (.xlsx + HTML-vienti)
```

Julkaisu: GitHub Pages tarjoilee `index.html`-tiedoston `main`-haaran juuresta.

## Lähde

Vilkas Suite tuki – [Kanta-asiakasohjelma](https://www.vilkas.fi/tuki/suite/kanta-asiakasohjelma)
(luettu 20.10.2026). Esimerkkiluvut ovat oletuksia, ei päätettyjä arvoja.
