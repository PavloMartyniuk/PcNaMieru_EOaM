# Zadanie webu: PC na mieru

## 1. Cieľ

Web „PC na mieru" je online konfigurátor a obchod, v ktorom si zákazník zostaví počítač presne podľa svojich potrieb a rozpočtu, alebo si vyberie hotové riešenie podľa využitia. Slúži súkromným osobám aj malým firmám. Ponúka profesionálnu montáž, testovanie zostavy a usporiadanie káblov.

**Štyri otázky:**
1. **Kto web používa?** Študenti a hráči, grafickí dizajnéri a živnostníci, malé firmy, ktoré potrebujú niekoľko rovnakých pracovných staníc.
2. **Aký problém rieši?** Hotové počítače vo veľkých obchodoch sú často nevyvážené (silný procesor, slabá grafická karta) a drahé. Konfigurátor stráži kompatibilitu dielov a ukazuje presnú cenu.
3. **V čom je lepší?** Individuálny prístup, poradenstvo, lepšia cena, jedna záruka a servis na celú zostavu.
4. **Prečo web vzniká?** Projekt nadšencov pre nadšencov: získať objednávky a dôveru zákazníkov.

**KPI:** počet dokončených konfigurácií, počet objednávok, mesačná návštevnosť, recenzie a spokojnosť zákazníkov.

**Rozsah (MVP):** statický web bez servera. Košík, uložené zostavy a história objednávok sa ukladajú do localStorage. Prihlasovanie, platby, PDF faktúry a notifikácie cien nie sú súčasťou MVP.

## 2. Používatelia

- **James Cullen** (21, študent, hráč CS): rozumie komponentom len čiastočne, nakupuje z mobilu. Bojí sa nekompatibilných dielov. Potrebuje hneď vidieť cenu, automatickú kontrolu kompatibility a „Uložiť zostavu". Firma od neho chce dokončenú konfiguráciu a nákup.
- **Martin Mortensen** (37, grafický dizajnér na živnosť): nechce klikať 40 dielov, bojí sa hlučného PC. Potrebuje výber podľa typu práce, tichú zostavu, garantovaný termín zloženia a jasnú cenu s montážou. Firma od neho chce nákup hotovej zostavy.
- **Christian Wolf Johannsen** (32, majiteľ účtovníckej firmy, 6 zamestnancov): počítačom nerozumie, nechce strácať čas. Potrebuje 5 rovnakých PC na jednu faktúru s IČO/DIČ, množstevnú zľavu, jednu záruku a možnosť dokúpiť rovnaký PC pre nového kolegu. Firma od neho chce firemnú objednávku.

## 3. Štruktúra webu

- **Domov:** Akcie, Ponuka, Poradenstvo, Nové komponenty (kategórie komponentov).
- **Konfigurátor:** výber dielov (CPU, základná doska, grafická karta), kontrola kompatibility, cena v reálnom čase, „Uložiť zostavu", objednanie montáže, hotové riešenia podľa využitia.
- **Košík a pokladňa:** zoznam položiek, množstvo, množstvová zľava, IČO/DIČ, spôsob platby, doprava, súhrn s montážou.
- **Info a pomoc:** FAQ, recenzie, kontakt a otváracie hodiny, O nás, doručenie a logistika, B2B spolupráca, obchodné podmienky.
- **Môj účet (rozšírenie):** uložené zostavy, história objednávok s „Kúpiť znova".

Mind mapa a tabuľka „potreba → funkcia" sú v dokumente „Návrh webu".

## 4. Obrazovky

Obrázky prototypu sú v `docs/prototyp/`.

1. **Domov** (`uvod.png`): hero s tlačidlom „Vybrať PC podľa využitia" (vedie na hotové riešenia v konfigurátore), 4 akčné karty (Detail, Kúpiť), 8 kategórií komponentov (vedú do konfigurátora), pätička s kontaktom.
2. **Konfigurátor a hotové riešenia** (`konfigurator.png`): vľavo vlastná zostava s tromi výbermi, zelené/červené hlásenie kompatibility, súčet vrátane montáže 39 €, tlačidlá „Konfigurácia a nákup" (do košíka) a „Uložiť zostavu". Vpravo hotové riešenia s cenou, hlučnosťou v dB a garantovaným termínom zloženia; „Kúpiť" pridá do košíka.
3. **Košík a pokladňa** (`kosik.png`): položky, množstvo, zľava od 5 kusov −10 %, IČO a DIČ, spôsob platby, doprava, súhrn objednávky, „Odoslať objednávku" vedie na potvrdenie.
4. **Potvrdenie** a **Info a pomoc**: jednoduché stránky bez samostatného prototypu.

Poznámka: objednávka sa nikam neodosiela, ide o ukážkový projekt.

## 5. Vizuálny štýl

Podrobnosti sú v `docs/style-guide.md`. Svetlý, čistý a prehľadný vzhľad podľa prototypu: biele pozadie, tmavomodrá pätička, modrý akcent na hlavné tlačidlá, zelená na potvrdenia a stav „Skladom". Bezpätkové písmo, veľa voľného miesta. V jednej sekcii len jedno výrazné primárne tlačidlo.