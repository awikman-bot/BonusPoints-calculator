# Bonuspisteiden laskentamalli

Interaktiivinen verkkosovellus, joka toistaa Google Sheets -laskentamallin
**Bonuspisteiden laskentamalli** kaavat selaimessa.

**Sovellus:** <https://awikman-bot.github.io/BonusPoints-calculator/>

## Mitä se tekee

Mallilla mitoitetaan verkkokaupan kanta-asiakasohjelma: montako pistettä eurosta
kertyy, mitä piste on arvoltaan, mitä tuotteet maksavat pisteinä ja paljonko
asiakas hyötyy vuoden aikana.

| Välilehti | Sisältö |
|---|---|
| **Malli** | Säännöt, ansaintataulukko, tuotteiden pistehinnat ja esimerkkiasiakkaan aikajana |
| **Tasot** | Tasovertailu – vain ansaitsemiskerroin muuttuu, pistehinnat pysyvät samoina |
| **Ohje** | Kolme sääntöä ja Vilkkaan laskentalogiikka |

Kaikki taulukot ovat muokattavia: rivejä voi lisätä ja poistaa, ja arvot
lasketaan uudelleen välittömästi. Syötteet tallentuvat selaimen
`localStorage`-muistiin; **Oletukset**-painike palauttaa alkuperäisen mallin arvot.

Tarkempi kuvaus: [help.html](https://awikman-bot.github.io/BonusPoints-calculator/help.html)

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
help.html                  laajempi kuvaus työkalusta
tests/formulas.test.js     regressiotesti: node tests/formulas.test.js
```

Julkaisu: GitHub Pages tarjoilee `index.html`-tiedoston `main`-haaran juuresta.
Sivut eivät tee yhtään ulkoista pyyntöä eivätkä lähetä syötteitä mihinkään.

## Alkuperäinen laskentataulukko

Sovellus toistaa Google Sheets -laskentamallin *Bonuspisteiden laskentamalli*
(välilehdet Ohje, Malli ja Tasot) kaavat sellaisinaan.

> **Vilkkaan sisäiseen käyttöön.** Tämä repositorio on julkinen, mutta alla oleva
> taulukko ei ole: se aukeaa vain Vilkkaan työntekijöille. Ulkopuolinen lukija
> saa linkistä vain Googlen käyttöoikeusilmoituksen – kaikki laskentaan tarvittava
> on kuvattu yllä olevissa kaavoissa ja [ohjesivulla](https://awikman-bot.github.io/BonusPoints-calculator/help.html).

<https://docs.google.com/spreadsheets/d/1Y_1cjktwFDzmIMRVb5RNIDdlyJqYw2QL-KsJ1rTAq2c/edit?gid=387336235#gid=387336235>

## Lähde

Vilkas Suite tuki – [Kanta-asiakasohjelma](https://www.vilkas.fi/tuki/suite/kanta-asiakasohjelma)
(luettu 20.10.2026). Esimerkkiluvut ovat oletuksia, ei päätettyjä arvoja.
