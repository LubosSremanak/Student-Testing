# Frontend
bwte2-frontned
## Štruktúra
Každa stránka ma index.html, v ktorom sa nachádza jeden hlavný komponent do ktorého sa zlievaju čiastkové komponenty.  
* bwte2
  * /app
    * /api
    * /components **Všetky komponenty**
    * /shared **Zdielane servisy alebo triedy, väčšinou framework**
    * /views **Všetky zobrazenia**
    * app.module.js **Modul na spracovanie komponentov**   
  * /assets 
  * favicon.png
  * index.html 
  * style.css **Globálne CSS**   
  * bwte2-api
  * bwte2-backend

### Prílohy
**Link na generator komponentov** https://wt143.fei.stuba.sk/generator/  
**Nezabudni** pridat vytvorený komponent do  app.module.js !!!  

## Konfigurácia
 1. Naklonuj všetky repozitáre, vlož **bwte2-api** a **bwte2-backend** na server, pričom dodrž vyšie uvedenú štruktúru  
    * Ak chceš mať frontned na servery, stači vložiť obsah priečinka src do priečinka bwte2, nieje potrebná dalšia konfigurácia 
    * Ak chceš spúšťať frontend z localhostu **Zmen** WT číslo XXX v adrese na svoje 
      * **Nájdi** /app -> /shared -> /model -> service -> api-service.js
      * **Zmeň číslo** this.rootURL = 'https://wtXXX.fei.stuba.sk/bwte2/bwte2-api/'; 
 2. Otvor koreňový index.html **Odkomentuj** sekciu s komponentami  a popridávaj si ich do PHPstormu 

## Verifikácia
Otvor koreňový index.html **Odkomentuj a otvor index.html v prehliadači**
```html
<app-api-test></app-api-test>
```
Ak ste všetko urobili správne dostanete tento výpis:<br>    
![image](https://user-images.githubusercontent.com/69248396/117101782-411c0180-ad77-11eb-911e-ec72fdbda0d8.png)<br> 
Ak sa vyskytnú nejake chyby, skontrolujte konzolu, ak request blokla CORS policy píšte do fóra backend-api, ak ho neblokla CORS policy skontrolujte štruktúru a konfiguráciu

## Práca so servismi
Servisy su triedy ktorých inštancie netreba volať pretože su automaticky injectnuté, v našom prípade, ak sa servis volá MenoServisuService
pristupime knemu bez inštancie nasledovne
```javascript
import {menoServisuService} from "../../shared/services/meno-servisu.service.js";
menoServisuService.metoda(); //import servisu je výhodné nechať robiť automaticky a len doplniť '.js' 
```
**Dôležité servisy bez ktorých sa nezobídete**
* DomService
  * bude opisaný v nasledujúcej sekcii   
* API -> všetky servisy 
  * API servisy používaju fetch, su asynchronne teda vracaju promise, pristupujeme knim pomocou then     

**Čítajte dokumentáciu tried všetky servisy su zdokumentované !!!**

## Práca s komponentami 
* Ak pri vytvárani komponentu vnorujete komponent do podpriečinka, napríklad do ďalšieho komponentu, **potrebujete pridať do ciest pre template a style daný priečinok**  
### Komunikácia medzi komponentami
* **Používame DomService**

#### Rodič -> Dieťa 
##### **Inline atribút**, túto metódu použijeme ak chceme komponentu definovať statickú vlastnosť priamo v HTML, vlastnosť môže byť len typu string   
   
  **Nastavenie 'inline' vlastnosti**
 ```html
//index.html 
<app-tutorial mnou-definovana-vlastnost="moj string" farba="biela" nazov-ktory-sa-nebude-menit="staticky nazov"></app-tuttorial>
```
##### Prečitanie 'inline' vlastnosti
```javascript
//app-dieta-tutorial.js
import {domService} from "../../shared/services/dom.service.js";
const nejakaFarba = domService.getInlineAttribute(this, 'farba'); //return biela
const nejakaFarba1 = domService.getInlineAttribute(this, 'farbaMoja'); //return NULL a Warning farbaMoja nebola nastavená 
```  
  
##### **Dynamicky atribút**, túto metódu použijeme ak chceme komponentu definovať dynamicku alebo staticku vlastnosť v javascripte, môže byť typu any
     
 **Nastavenie dynamickej/statickej vlastnosti z javascriptu**
 ```javascript
//app-rodic-tutorial.js
import {domService} from "../../shared/services/dom.service.js";
const data={ meno:"lubos", vek:21, citiSaNa:80 };
const componentAppTutorial = this.dom.getElementById("id-app-tutorial");
domService.setAttribute(componentAppTutorial, "nejakyObjektAleboPremenna", data);
```
**Prečitanie dynamickej/statickej vlastnosti z javascriptu**
  ```javascript
//app-dieta-tutorial.js
import {domService} from "../../shared/services/dom.service.js";
const headerName = domService.getAttribute(this, "nejakyObjektAleboPremenna"); //return { meno:"lubos", vek:21, citiSaNa:80 }
```

#### Dieťa -> Rodič
##### Event emit      
**Nastavenie eventu a vlozenie dat do eventu**
 ```javascript
//app-dieta-tutorial.js
import {domService} from "../../shared/services/dom.service.js";
const data={ mikofloso:"rytmo" };
//moznost1
const event= domService.createEvent("mojEvent", data); //vytvori event a vlozi donho data
domService.emitEvent(this, event); // vyvolá event
//moznost2
domService.createAndEmitEvent(this, "mojEvent", data);  // urobi to iste co predošla možnosť v jednom kroku
```
**Reakcia na event a precitanie dat eventu, vzdy ku datam pristupujeme cez premennu detail (tak to je urcene v JS) !!!**
```javascript
//app-rodic-tutorial.js
 this.dom.getElementById("send-test-button").addEventListener('mojEvent', (eventData)=>{
  const premennaZDietata=eventData.detail; //return { mikofloso:"rytmo" }
 });
```

#### Dieťa -> Dieťa
**Globálny event**
```javascript
//nevytvara event na this ale priamo na document to iste pri odchytávani eventu
domService.emitEvent(document, event); // vyvolá event
document.addEventListener(...);
```






