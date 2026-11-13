window.PCNM_PRODUCTS = {
  customBuild: { montaz: 39 },

  // Procesory: zachované ID už používaných modelov, doplnené údaje pre kompatibilitu.
  processors: [
    { id: "cpu-ryzen-5-7600", nazov: "AMD Ryzen 5 7600", cena: 189, obrazok: "img/akcia1.jpg", alt: "Procesor AMD Ryzen 5 7600", socket: "AM5", tdp: 65, integrovanaGrafika: true, chladicVBalení: true },
    { id: "cpu-ryzen-5-5600", nazov: "AMD Ryzen 5 5600", cena: 119, obrazok: "img/akcia2.jpg", alt: "Procesor AMD Ryzen 5 5600", socket: "AM4", tdp: 65, integrovanaGrafika: false, chladicVBalení: true },
    { id: "cpu-ryzen-5-7500f", nazov: "AMD Ryzen 5 7500F", cena: 169, obrazok: "img/akcia1.jpg", alt: "Procesor AMD Ryzen 5 7500F", socket: "AM5", tdp: 65, integrovanaGrafika: false, chladicVBalení: false },
    { id: "cpu-core-i5-14400f", nazov: "Intel Core i5-14400F", cena: 219, obrazok: "img/akcia1.jpg", alt: "Procesor Intel Core i5-14400F", socket: "LGA1700", tdp: 148, integrovanaGrafika: false, chladicVBalení: true },
    { id: "cpu-core-i5-14600kf", nazov: "Intel Core i5-14600KF", cena: 279, obrazok: "img/akcia2.jpg", alt: "Procesor Intel Core i5-14600KF", socket: "LGA1700", tdp: 181, integrovanaGrafika: true, chladicVBalení: false },
    { id: "cpu-ryzen-5-8500g", nazov: "AMD Ryzen 5 8500G", cena: 159, obrazok: "img/akcia1.jpg", alt: "Procesor AMD Ryzen 5 8500G", socket: "AM5", tdp: 65, integrovanaGrafika: true, chladicVBalení: true },
    { id: "cpu-ryzen-5-8400f", nazov: "AMD Ryzen 5 8400F", cena: 149, obrazok: "img/akcia2.jpg", alt: "Procesor AMD Ryzen 5 8400F", socket: "AM5", tdp: 65, integrovanaGrafika: false, chladicVBalení: false },
    { id: "cpu-core-i7-14700f", nazov: "Intel Core i7-14700F", cena: 369, obrazok: "img/hero1.jpg", alt: "Procesor Intel Core i7-14700F", socket: "LGA1700", tdp: 219, integrovanaGrafika: false, chladicVBalení: false }
  ],

  // Základné dosky: socket, pamäťový štandard a formát určujú kompatibilitu.
  motherboards: [
    { id: "mb-msi-b650", nazov: "MSI B650 Gaming Plus WiFi", cena: 169, obrazok: "img/akcia4.jpg", alt: "Základná doska MSI B650 Gaming Plus WiFi", socket: "AM5", ramTyp: "DDR5", format: "ATX" },
    { id: "mb-asus-b650m", nazov: "ASUS TUF Gaming B650M-Plus", cena: 159, obrazok: "img/akcia4.jpg", alt: "Základná doska ASUS TUF Gaming B650M-Plus", socket: "AM5", ramTyp: "DDR5", format: "mATX" },
    { id: "mb-gigabyte-a520", nazov: "Gigabyte A520M DS3H", cena: 79, obrazok: "img/akcia4.jpg", alt: "Základná doska Gigabyte A520M DS3H", socket: "AM4", ramTyp: "DDR4", format: "mATX" },
    { id: "mb-msi-b760", nazov: "MSI PRO B760-P WiFi", cena: 149, obrazok: "img/akcia4.jpg", alt: "Základná doska MSI PRO B760-P WiFi", socket: "LGA1700", ramTyp: "DDR5", format: "ATX" },
    { id: "mb-asus-z790", nazov: "ASUS TUF Gaming Z790-Plus", cena: 239, obrazok: "img/akcia4.jpg", alt: "Základná doska ASUS TUF Gaming Z790-Plus", socket: "LGA1700", ramTyp: "DDR5", format: "ATX" },
    { id: "mb-asrock-b650i-lightning", nazov: "ASRock B650I Lightning WiFi", cena: 199, obrazok: "img/akcia4.jpg", alt: "Základná doska ASRock B650I Lightning WiFi", socket: "AM5", ramTyp: "DDR5", format: "ITX" },
    { id: "mb-gigabyte-b760m-ds3h-ddr4", nazov: "Gigabyte B760M DS3H DDR4", cena: 119, obrazok: "img/akcia4.jpg", alt: "Základná doska Gigabyte B760M DS3H DDR4", socket: "LGA1700", ramTyp: "DDR4", format: "mATX" },
    { id: "mb-asrock-b550i", nazov: "ASRock B550M-ITX/ac", cena: 169, obrazok: "img/akcia4.jpg", alt: "Základná doska ASRock B550M-ITX/ac", socket: "AM4", ramTyp: "DDR4", format: "ITX" }
  ],

  // Pamäte RAM: kapacita predstavuje celkovú kapacitu súpravy.
  ram: [
    { id: "ram-ddr5-16", nazov: "Kingston Fury Beast DDR5 16 GB", cena: 59, obrazok: "img/akcia2.jpg", alt: "Pamäť Kingston Fury Beast DDR5 16 GB", typ: "DDR5", kapacita: 16 },
    { id: "ram-ddr5-32", nazov: "Kingston Fury Beast DDR5 32 GB", cena: 99, obrazok: "img/akcia2.jpg", alt: "Pamäť Kingston Fury Beast DDR5 32 GB", typ: "DDR5", kapacita: 32 },
    { id: "ram-ddr4-16", nazov: "Corsair Vengeance LPX DDR4 16 GB", cena: 42, obrazok: "img/akcia2.jpg", alt: "Pamäť Corsair Vengeance LPX DDR4 16 GB", typ: "DDR4", kapacita: 16 },
    { id: "ram-ddr4-32", nazov: "Kingston Fury Beast DDR4 32 GB", cena: 68, obrazok: "img/akcia2.jpg", alt: "Pamäť Kingston Fury Beast DDR4 32 GB", typ: "DDR4", kapacita: 32 },
    { id: "ram-ddr5-64", nazov: "Kingston Fury Beast DDR5 64 GB", cena: 189, obrazok: "img/akcia2.jpg", alt: "Pamäť Kingston Fury Beast DDR5 64 GB", typ: "DDR5", kapacita: 64 },
    { id: "ram-ddr4-64", nazov: "Corsair Vengeance LPX DDR4 64 GB", cena: 119, obrazok: "img/akcia2.jpg", alt: "Pamäť Corsair Vengeance LPX DDR4 64 GB", typ: "DDR4", kapacita: 64 }
  ],

  // Grafické karty: dĺžka a spotreba sa porovnávajú so skriňou a zdrojom.
  graphicsCards: [
    { id: "gpu-rtx-4060", nazov: "GeForce RTX 4060", cena: 399, obrazok: "img/akcia4.jpg", alt: "Grafická karta GeForce RTX 4060", tdp: 115, dlzkaMm: 240 },
    { id: "gpu-rx-7600", nazov: "Radeon RX 7600", cena: 289, obrazok: "img/akcia1.jpg", alt: "Grafická karta Radeon RX 7600", tdp: 165, dlzkaMm: 270 },
    { id: "gpu-rtx-4070-super", nazov: "GeForce RTX 4070 SUPER", cena: 649, obrazok: "img/akcia4.jpg", alt: "Grafická karta GeForce RTX 4070 SUPER", tdp: 220, dlzkaMm: 336 },
    { id: "gpu-rx-7800-xt", nazov: "Radeon RX 7800 XT", cena: 549, obrazok: "img/akcia1.jpg", alt: "Grafická karta Radeon RX 7800 XT", tdp: 263, dlzkaMm: 320 },
    { id: "gpu-rx-6600", nazov: "Radeon RX 6600", cena: 239, obrazok: "img/akcia1.jpg", alt: "Grafická karta Radeon RX 6600", tdp: 132, dlzkaMm: 235 },
    { id: "gpu-rtx-4070-ti-super", nazov: "GeForce RTX 4070 Ti SUPER", cena: 849, obrazok: "img/akcia4.jpg", alt: "Grafická karta GeForce RTX 4070 Ti SUPER", tdp: 285, dlzkaMm: 340 },
    { id: "gpu-rx-7900-xtx", nazov: "Radeon RX 7900 XTX", cena: 999, obrazok: "img/akcia1.jpg", alt: "Grafická karta Radeon RX 7900 XTX", tdp: 355, dlzkaMm: 360 }
  ],

  // SSD disky: kapacita je uvádzaná v gigabajtoch.
  ssds: [
    { id: "ssd-nvme-500", nazov: "WD Blue SN580 500 GB NVMe", cena: 49, obrazok: "img/akcia2.jpg", alt: "SSD disk WD Blue SN580 500 GB", kapacita: 500 },
    { id: "ssd-nvme-1000", nazov: "Samsung 990 EVO 1 TB NVMe", cena: 89, obrazok: "img/akcia2.jpg", alt: "SSD disk Samsung 990 EVO 1 TB", kapacita: 1000 },
    { id: "ssd-nvme-2000", nazov: "WD Black SN770 2 TB NVMe", cena: 149, obrazok: "img/akcia2.jpg", alt: "SSD disk WD Black SN770 2 TB", kapacita: 2000 },
    { id: "ssd-sata-500", nazov: "Crucial BX500 500 GB SATA", cena: 39, obrazok: "img/akcia2.jpg", alt: "SSD disk Crucial BX500 500 GB SATA", kapacita: 500 },
    { id: "ssd-nvme-1000-kingston", nazov: "Kingston NV2 1 TB NVMe", cena: 74, obrazok: "img/akcia2.jpg", alt: "SSD disk Kingston NV2 1 TB NVMe", kapacita: 1000 },
    { id: "ssd-nvme-2000-crucial", nazov: "Crucial P3 Plus 2 TB NVMe", cena: 139, obrazok: "img/akcia2.jpg", alt: "SSD disk Crucial P3 Plus 2 TB NVMe", kapacita: 2000 }
  ],

  // Chladiče: pri voľbe „Nepotrebujem“ musí mať procesor chladič v balení.
  coolers: [
    { id: "cooler-deepcool-ak400", nazov: "DeepCool AK400", cena: 35, obrazok: "img/akcia2.jpg", alt: "Chladič procesora DeepCool AK400", sockety: ["AM4", "AM5", "LGA1700"], vykonTdp: 180, vyskaMm: 155 },
    { id: "cooler-be-quiet-pure-rock-2", nazov: "be quiet! Pure Rock 2", cena: 45, obrazok: "img/akcia2.jpg", alt: "Chladič procesora be quiet! Pure Rock 2", sockety: ["AM4", "AM5", "LGA1700"], vykonTdp: 200, vyskaMm: 155 },
    { id: "cooler-noctua-nh-d15", nazov: "Noctua NH-D15", cena: 109, obrazok: "img/akcia2.jpg", alt: "Chladič procesora Noctua NH-D15", sockety: ["AM4", "AM5", "LGA1700"], vykonTdp: 250, vyskaMm: 165 },
    { id: "cooler-arctic-freezer-36", nazov: "Arctic Freezer 36", cena: 32, obrazok: "img/akcia2.jpg", alt: "Vzduchový chladič procesora Arctic Freezer 36", typ: "Vzduchový", sockety: ["AM4", "AM5", "LGA1700"], vykonTdp: 200, vyskaMm: 159 },
    { id: "cooler-deepcool-ls520", nazov: "DeepCool LS520 SE", cena: 89, obrazok: "img/akcia2.jpg", alt: "Vodný chladič procesora DeepCool LS520 SE", typ: "Vodný AIO", sockety: ["AM4", "AM5", "LGA1700"], vykonTdp: 280, vyskaMm: 52 },
    { id: "cooler-arctic-liquid-freezer-iii", nazov: "Arctic Liquid Freezer III 240", cena: 99, obrazok: "img/akcia2.jpg", alt: "Vodný chladič procesora Arctic Liquid Freezer III 240", typ: "Vodný AIO", sockety: ["AM5", "LGA1700"], vykonTdp: 300, vyskaMm: 63 }
  ],

  // Zdroje: pri výbere sa ponecháva výkonová rezerva 150 W.
  powerSupplies: [
    { id: "psu-450", nazov: "be quiet! System Power 10 450 W", cena: 55, obrazok: "img/akcia3.jpg", alt: "Počítačový zdroj s výkonom 450 W", vykonW: 450 },
    { id: "psu-550", nazov: "Corsair CX550 550 W", cena: 69, obrazok: "img/akcia3.jpg", alt: "Počítačový zdroj s výkonom 550 W", vykonW: 550 },
    { id: "psu-650", nazov: "Seasonic G12 GC-650 650 W", cena: 89, obrazok: "img/akcia3.jpg", alt: "Počítačový zdroj s výkonom 650 W", vykonW: 650 },
    { id: "psu-850", nazov: "Corsair RM850e 850 W", cena: 129, obrazok: "img/akcia3.jpg", alt: "Počítačový zdroj s výkonom 850 W", vykonW: 850 },
    { id: "psu-750", nazov: "Seasonic G12 GC-750 750 W", cena: 109, obrazok: "img/akcia3.jpg", alt: "Počítačový zdroj s výkonom 750 W", vykonW: 750 },
    { id: "psu-1000", nazov: "Corsair RM1000e 1000 W", cena: 169, obrazok: "img/akcia3.jpg", alt: "Počítačový zdroj s výkonom 1000 W", vykonW: 1000 }
  ],

  // Skrine: podporované formáty a maximálne rozmery obmedzujú výber dielov.
  cases: [
    { id: "case-matx-compact", nazov: "DeepCool CH370 mATX", cena: 69, obrazok: "img/akcia3.jpg", alt: "Kompaktná skriňa DeepCool CH370 mATX", podporovaneFormaty: ["mATX", "ITX"], maxDlzkaGpuMm: 270, maxVyskaChladicaMm: 145 },
    { id: "case-matx-air", nazov: "Fractal Design Pop Mini Air", cena: 89, obrazok: "img/akcia3.jpg", alt: "Skriňa Fractal Design Pop Mini Air", podporovaneFormaty: ["mATX", "ITX"], maxDlzkaGpuMm: 365, maxVyskaChladicaMm: 170 },
    { id: "case-atx-air", nazov: "Corsair 3000D Airflow", cena: 79, obrazok: "img/akcia3.jpg", alt: "Skriňa Corsair 3000D Airflow", podporovaneFormaty: ["ATX", "mATX", "ITX"], maxDlzkaGpuMm: 360, maxVyskaChladicaMm: 170 },
    { id: "case-atx-tower", nazov: "Fractal Design Meshify 2", cena: 159, obrazok: "img/akcia3.jpg", alt: "Skriňa Fractal Design Meshify 2", podporovaneFormaty: ["ATX", "mATX", "ITX"], maxDlzkaGpuMm: 400, maxVyskaChladicaMm: 185 },
    { id: "case-itx-compact", nazov: "Cooler Master NR200", cena: 99, obrazok: "img/akcia3.jpg", alt: "Kompaktná ITX skriňa Cooler Master NR200", podporovaneFormaty: ["ITX"], maxDlzkaGpuMm: 330, maxVyskaChladicaMm: 155 },
    { id: "case-atx-big", nazov: "be quiet! Pure Base 500DX", cena: 119, obrazok: "img/akcia3.jpg", alt: "Veľká ATX skriňa be quiet! Pure Base 500DX", podporovaneFormaty: ["ATX", "mATX", "ITX"], maxDlzkaGpuMm: 369, maxVyskaChladicaMm: 190 }
  ],

  // Hotové zostavy zostávajú samostatné a zachovávajú pôvodné ID aj ceny.
  readyBuilds: [
    { id: "gamer-pro-cs2", nazov: "Gamer Pro CS2", cena: 899, obrazok: "img/cs2pc.jpg", montaz: 0, kategoria: "hra", pouzitie: "Hra", hlucnost: 32, popis: "Plynulé hranie CS2 a ďalších obľúbených hier s rezervou na ďalšie roky.", alt: "Herný počítač Gamer Pro CS2" },
    { id: "studentsky-esport-pc", nazov: "Študentský e-šport PC", cena: 849, obrazok: "img/akcia1.jpg", montaz: 0, kategoria: "hra", pouzitie: "Hra", hlucnost: 31, popis: "Vyvážená zostava na hranie obľúbených hier aj štúdium.", alt: "Herný počítač pre študenta a e-šport" },
    { id: "ticha-zostava-grafici", nazov: "Tichá zostava pre grafikov", cena: 1290, obrazok: "img/akcia2.jpg", montaz: 0, kategoria: "grafika", pouzitie: "Grafika", hlucnost: 19, popis: "Tichá pracovná stanica pre grafiku, video a kreatívnu prácu.", alt: "Tichá pracovná zostava pre grafikov" },
    { id: "office-b2b-pack", nazov: "Office B2B Pack", cena: 490, obrazok: "img/akcia3.jpg", montaz: 0, kategoria: "firma", pouzitie: "Firma", hlucnost: 25, popis: "Jedna faktúra a množstevná zľava 10 % od 5 kusov.", alt: "Kancelárska pracovná zostava Office B2B Pack" }
  ]
};
