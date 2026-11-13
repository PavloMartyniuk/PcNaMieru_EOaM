(function () {
  "use strict";

  const products = window.PCNM_PRODUCTS;
  const cartKey = "pcnm_kosik";
  const savedBuildsKey = "pcnm_zostavy";

  function readStorage(key, fallback) {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue === null ? fallback : JSON.parse(storedValue);
    } catch (error) {
      console.error(`Nepodarilo sa načítať údaje „${key}“ z localStorage.`, error);
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Nepodarilo sa uložiť údaje „${key}“ do localStorage.`, error);
      window.alert("Údaje sa nepodarilo uložiť. Skontrolujte nastavenia úložiska prehliadača.");
      return false;
    }
  }

  function getCart() {
    const cart = readStorage(cartKey, []);
    if (!Array.isArray(cart)) {
      console.error(`Údaje „${cartKey}“ nemajú očakávaný formát zoznamu.`);
      return [];
    }
    return cart;
  }

  function updateCartCount() {
    const count = getCart().reduce((sum, item) => {
      const quantity = Number(item.mnozstvo);
      return sum + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
    }, 0);

    document.querySelectorAll(".cart-count").forEach((badge) => {
      badge.textContent = String(count);
    });
  }

  function addToCart(product) {
    const cart = getCart();
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.nazov = product.nazov;
      existing.cena = product.cena;
      existing.montaz = product.montaz;
      if (Array.isArray(product.detail)) existing.detail = product.detail;
      existing.mnozstvo = Math.max(1, Number(existing.mnozstvo) || 1) + product.mnozstvo;
    } else {
      cart.push(product);
    }

    if (!writeStorage(cartKey, cart)) {
      return false;
    }
    updateCartCount();
    return true;
  }

  function formatPrice(value) {
    return `${new Intl.NumberFormat("sk-SK", { maximumFractionDigits: 0 }).format(value)} €`;
  }

  function quantityNoun(quantity) {
    const lastTwoDigits = quantity % 100;
    if (quantity === 1) return "kus";
    if (quantity % 10 >= 2 && quantity % 10 <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) return "kusy";
    return "kusov";
  }

  function allCatalogProducts() {
    return [
      ...products.processors,
      ...products.motherboards,
      ...products.graphicsCards,
      ...products.readyBuilds
    ];
  }

  function findProduct(id) {
    return allCatalogProducts().find((product) => product.id === id);
  }

  function initializeHomeDeals() {
    document.querySelectorAll(".deal-card[data-product-id]").forEach((card) => {
      const product = findProduct(card.dataset.productId);
      if (!product) {
        console.error(`Produkt „${card.dataset.productId}“ sa nenašiel v katalógu.`);
        return;
      }

      const title = card.querySelector(".deal-content h3");
      const description = card.querySelector(".deal-content > p");
      const price = card.querySelector(".deal-price");
      const image = card.querySelector(".deal-image img");
      const buyButton = card.querySelector(".deal-actions .button-primary");

      if (title) title.textContent = product.nazov;
      if (description && product.popis) description.textContent = product.popis;
      if (price) price.textContent = formatPrice(product.cena);
      if (image) {
        image.src = product.obrazok;
        image.alt = product.alt || product.nazov;
      }
      if (buyButton) {
        buyButton.dataset.addToCart = product.id;
        buyButton.href = "kosik.html";
        buyButton.setAttribute("aria-label", `Kúpiť: ${product.nazov}`);
      }
    });
  }

  function initializeReviews() {
    const containers = document.querySelectorAll("[data-reviews-list]");
    if (containers.length === 0) return;

    const reviews = window.PCNM_REVIEWS;
    if (!Array.isArray(reviews)) {
      console.error("Recenzie sa nenačítali. Skontrolujte cestu k data/recenzie.js.");
      return;
    }

    containers.forEach((container) => {
      container.replaceChildren();
      reviews.forEach((review) => {
        const card = document.createElement("article");
        card.className = "info-card review-card";

        const badge = document.createElement("p");
        badge.className = "review-label";
        badge.textContent = "Ukážková recenzia";

        const stars = document.createElement("p");
        stars.className = "review-stars";
        stars.textContent = "★★★★★";
        stars.setAttribute("role", "img");
        stars.setAttribute("aria-label", "5 hviezdičiek z 5");

        const quote = document.createElement("blockquote");
        quote.textContent = `„${review.text}“`;

        const author = document.createElement("p");
        author.className = "review-author";
        author.textContent = review.meno;

        card.append(badge, stars, quote, author);
        container.append(card);
      });
    });
  }

  function handleBuyClick(event) {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;

    const product = findProduct(button.dataset.addToCart);
    if (!product) {
      console.error(`Produkt „${button.dataset.addToCart}“ sa nenašiel v katalógu.`);
      return;
    }

    event.preventDefault();
    const added = addToCart({
      id: product.id,
      nazov: product.nazov,
      cena: product.cena,
      montaz: product.montaz,
      mnozstvo: 1
    });
    if (added) window.location.href = "kosik.html";
  }

  function initializeConfigurator() {
    const form = document.getElementById("custom-build-form");
    const buildGrid = document.getElementById("ready-build-grid");
    if (!form || !buildGrid) return;

    const noneValue = "none";
    const componentFields = [
      { key: "processor", id: "processor-select", statusId: "processor-status", label: "procesor", items: products.processors, required: true, savedKey: "processorId" },
      { key: "motherboard", id: "motherboard-select", statusId: "motherboard-status", label: "základnú dosku", items: products.motherboards, required: true, savedKey: "motherboardId" },
      { key: "ram", id: "ram-select", statusId: "ram-status", label: "pamäť RAM", items: products.ram, required: true, savedKey: "ramId" },
      { key: "graphicsCard", id: "graphics-card-select", statusId: "graphics-card-status", label: "grafickú kartu", items: products.graphicsCards, required: false, optional: true, savedKey: "graphicsCardId" },
      { key: "ssd", id: "ssd-select", statusId: "ssd-status", label: "SSD disk", items: products.ssds, required: true, savedKey: "ssdId" },
      { key: "cooler", id: "cooler-select", statusId: "cooler-status", label: "chladič procesora", items: products.coolers, required: false, optional: true, savedKey: "coolerId" },
      { key: "powerSupply", id: "power-supply-select", statusId: "power-supply-status", label: "zdroj", items: products.powerSupplies, required: true, savedKey: "powerSupplyId" },
      { key: "computerCase", id: "case-select", statusId: "case-status", label: "skriňu", items: products.cases, required: true, savedKey: "caseId" }
    ];
    const selects = new Map(componentFields.map((field) => [field.key, document.getElementById(field.id)]));
    const statuses = new Map(componentFields.map((field) => [field.key, document.getElementById(field.statusId)]));
    const buildStatus = document.getElementById("build-status");
    const partsPrice = document.getElementById("parts-price");
    const assemblyPrice = document.getElementById("assembly-price");
    const buildTotal = document.getElementById("build-total");
    const saveMessage = document.getElementById("saved-build-message");
    const saveButton = document.getElementById("save-build");
    const purchaseButton = document.getElementById("add-custom-build");
    const purchaseDisabledReason = document.getElementById("purchase-disabled-reason");

    function populateSelect(select, items, placeholder, optional) {
      select.replaceChildren();
      if (optional) {
        const noneOption = document.createElement("option");
        noneOption.value = noneValue;
        noneOption.textContent = "Nepotrebujem";
        select.append(noneOption);
      } else {
        const emptyOption = document.createElement("option");
        emptyOption.value = "";
        emptyOption.textContent = placeholder;
        emptyOption.disabled = true;
        select.append(emptyOption);
      }

      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.nazov} — ${formatPrice(item.cena)}`;
        select.append(option);
      });
    }

    componentFields.forEach((field) => {
      const select = selects.get(field.key);
      populateSelect(select, field.items, `Vyberte ${field.label}`, field.optional);
      if (field.optional) select.value = noneValue;
    });

    function selectedComponents() {
      return Object.fromEntries(componentFields.map((field) => {
        const value = selects.get(field.key).value;
        return [field.key, value && value !== noneValue
          ? field.items.find((item) => item.id === value)
          : null];
      }));
    }

    function currentSelection() {
      return Object.fromEntries(componentFields.map((field) => [field.savedKey, selects.get(field.key).value || ""]));
    }

    function validateCompatibility(selection) {
      const problems = [];
      const addProblem = (key, message) => problems.push({ key, message });
      const { processor, motherboard, ram, graphicsCard, cooler, powerSupply, computerCase } = selection;

      if (processor && motherboard && processor.socket !== motherboard.socket) {
        addProblem("motherboard", `Procesor je ${processor.socket}, doska ${motherboard.socket}. Zmeňte procesor na model s ${motherboard.socket} alebo dosku na model s ${processor.socket}.`);
      }
      if (ram && motherboard && ram.typ !== motherboard.ramTyp) {
        addProblem("ram", `Pamäť je ${ram.typ}, doska podporuje ${motherboard.ramTyp}. Vyberte RAM typu ${motherboard.ramTyp} alebo dosku s podporou ${ram.typ}.`);
      }
      if (computerCase && motherboard && !computerCase.podporovaneFormaty.includes(motherboard.format)) {
        addProblem("computerCase", `Skriňa nepodporuje formát dosky ${motherboard.format}. Vyberte skriňu s podporou ${motherboard.format} alebo dosku s podporovaným formátom.`);
      }
      if (processor && powerSupply) {
        const neededPower = processor.tdp + (graphicsCard ? graphicsCard.tdp : 0) + 150;
        if (powerSupply.vykonW < neededPower) {
          addProblem("powerSupply", `Zdroj má ${powerSupply.vykonW} W, zostava potrebuje aspoň ${neededPower} W. Vyberte silnejší zdroj.`);
        }
      }
      if (graphicsCard && computerCase && graphicsCard.dlzkaMm > computerCase.maxDlzkaGpuMm) {
        addProblem("graphicsCard", `Grafická karta má dĺžku ${graphicsCard.dlzkaMm} mm, skriňa podporuje najviac ${computerCase.maxDlzkaGpuMm} mm. Vyberte kratšiu kartu alebo väčšiu skriňu.`);
      }
      if (cooler && processor && !cooler.sockety.includes(processor.socket)) {
        addProblem("cooler", `Chladič nepodporuje socket ${processor.socket}. Vyberte chladič kompatibilný so socketom ${processor.socket}.`);
      }
      if (cooler && computerCase && cooler.vyskaMm > computerCase.maxVyskaChladicaMm) {
        addProblem("cooler", `Chladič má výšku ${cooler.vyskaMm} mm, skriňa podporuje najviac ${computerCase.maxVyskaChladicaMm} mm. Vyberte nižší chladič alebo väčšiu skriňu.`);
      }
      if (cooler && processor && cooler.vykonTdp < processor.tdp) {
        addProblem("cooler", `Chladič zvláda ${cooler.vykonTdp} W, procesor má TDP ${processor.tdp} W. Vyberte výkonnejší chladič.`);
      }
      if (processor && selects.get("graphicsCard").value === noneValue && !processor.integrovanaGrafika) {
        addProblem("graphicsCard", "Procesor nemá integrovanú grafiku. Vyberte grafickú kartu.");
      }
      if (processor && selects.get("cooler").value === noneValue && !processor.chladicVBalení) {
        addProblem("cooler", "Procesor nemá chladič v balení. Vyberte chladič procesora.");
      }

      return problems;
    }

    function updateBuildSummary() {
      const selection = selectedComponents();
      const missing = componentFields
        .filter((field) => field.required && !selects.get(field.key).value)
        .map((field) => field.label);
      const problems = validateCompatibility(selection);
      const selectedParts = componentFields.map((field) => selection[field.key]).filter(Boolean);
      const parts = selectedParts.reduce((sum, item) => sum + item.cena, 0);
      const assembly = products.customBuild.montaz;
      const complete = missing.length === 0;
      const compatible = problems.length === 0;

      partsPrice.textContent = formatPrice(parts);
      assemblyPrice.textContent = formatPrice(assembly);
      buildTotal.textContent = formatPrice(parts + assembly);
      statuses.forEach((status) => {
        status.textContent = "";
        status.classList.remove("is-compatible", "is-incompatible");
      });
      problems.forEach(({ key, message }) => {
        const status = statuses.get(key);
        status.textContent += `${status.textContent ? " " : "⚠ "}${message}`;
        status.classList.add("is-incompatible");
      });

      if (missing.length > 0) {
        buildStatus.textContent = `⚠ Chýba vybrať: ${missing.join(", ")}.${problems.length ? ` Problémov kompatibility: ${problems.length}.` : ""}`;
      } else if (problems.length > 0) {
        buildStatus.textContent = `⚠ Počet problémov kompatibility: ${problems.length}.`;
      } else {
        buildStatus.textContent = "✓ Všetky vybrané diely k sebe 100 % pasujú.";
      }
      buildStatus.classList.toggle("is-compatible", complete && compatible);
      buildStatus.classList.toggle("is-incompatible", !complete || !compatible);

      purchaseButton.disabled = !complete || !compatible;
      if (purchaseButton.disabled) {
        const reasons = [];
        if (missing.length > 0) reasons.push(`Chýba vybrať: ${missing.join(", ")}.`);
        if (problems.length > 0) reasons.push(`Nesúlad: ${problems.map((problem) => problem.message).join(" ")}`);
        purchaseDisabledReason.textContent = reasons.join(" ");
      } else {
        purchaseDisabledReason.textContent = "";
      }
      return { selection, compatible: complete && compatible, parts, selectedParts, missing, problems };
    }

    const savedBuilds = readStorage(savedBuildsKey, []);
    if (Array.isArray(savedBuilds) && savedBuilds.length > 0) {
      const requestedBuildId = new URLSearchParams(window.location.search).get("zostava");
      const requestedBuild = requestedBuildId
        ? savedBuilds.find((build) => build && build.id === requestedBuildId)
        : null;
      if (requestedBuildId && !requestedBuild) {
        console.error(`Uložená zostava „${requestedBuildId}“ sa nenašla.`);
      }
      const selectedBuild = requestedBuild || savedBuilds[savedBuilds.length - 1];
      if (selectedBuild) {
        componentFields.forEach((field) => {
          const value = selectedBuild[field.savedKey] || "";
          const exists = field.items.some((item) => item.id === value);
          if (exists) {
            selects.get(field.key).value = value;
          } else if (value) {
            console.error(`Diel „${value}“ uloženej zostavy sa nenašiel v kategórii ${field.label}.`);
            selects.get(field.key).value = "";
          } else {
            selects.get(field.key).value = "";
          }
        });
      }
    } else if (savedBuilds !== null && !Array.isArray(savedBuilds)) {
      console.error(`Údaje „${savedBuildsKey}“ nemajú očakávaný formát zoznamu.`);
    }

    componentFields.forEach((field) => {
      const select = selects.get(field.key);
      select.addEventListener("change", () => {
        saveMessage.textContent = "";
        updateBuildSummary();
      });
    });
    updateBuildSummary();

    saveButton.addEventListener("click", () => {
      const summary = updateBuildSummary();
      if (summary.selectedParts.length === 0) {
        saveMessage.textContent = "Najprv vyberte aspoň jeden komponent.";
        return;
      }
      const selection = currentSelection();
      const currentSavedBuilds = readStorage(savedBuildsKey, []);
      const saved = Array.isArray(currentSavedBuilds) ? currentSavedBuilds : [];
      const selectionKey = componentFields.map((field) => selection[field.savedKey] || "bez").join("-");
      const id = `vlastna-${selectionKey}`;
      const name = summary.selectedParts.map((item) => item.nazov).join(", ");
      const updated = saved.filter((item) => item.id !== id);
      updated.push({ id, nazov: name, ...selection, ulozene: new Date().toISOString() });

      if (writeStorage(savedBuildsKey, updated)) {
        saveMessage.textContent = "Zostava bola uložená. Pri ďalšej návšteve sa výber obnoví.";
      }
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const summary = updateBuildSummary();
      if (!summary.compatible) return;

      const selectionKey = componentFields.map((field) => selects.get(field.key).value || "bez").join("-");
      const id = `vlastna-${selectionKey}`;
      const added = addToCart({
        id,
        nazov: "Vlastná zostava",
        cena: summary.parts,
        montaz: products.customBuild.montaz,
        detail: summary.selectedParts.map((item) => item.nazov),
        mnozstvo: 1
      });
      if (added) window.location.href = "kosik.html";
    });

    function renderReadyBuilds(filter) {
      buildGrid.replaceChildren();
      products.readyBuilds
        .filter((build) => filter === "vsetko" || build.kategoria === filter)
        .forEach((build) => {
          const card = document.createElement("article");
          card.className = "ready-build-card";

          const image = document.createElement("img");
          image.src = build.obrazok;
          image.alt = build.alt || build.nazov;
          image.className = "ready-build-image";

          const body = document.createElement("div");
          body.className = "ready-build-content";

          const badge = document.createElement("span");
          badge.className = "ready-build-badge";
          badge.textContent = build.pouzitie;

          const title = document.createElement("h3");
          title.textContent = build.nazov;

          const description = document.createElement("p");
          description.textContent = build.popis;

          const details = document.createElement("p");
          details.className = "ready-build-details";
          details.textContent = `${build.hlucnost} dB · Zloženie do 48 hodín`;

          const footer = document.createElement("div");
          footer.className = "ready-build-footer";

          const price = document.createElement("strong");
          price.textContent = formatPrice(build.cena);

          const stock = document.createElement("span");
          stock.className = "stock-badge";
          stock.textContent = "Skladom";

          const buyButton = document.createElement("button");
          buyButton.type = "button";
          buyButton.className = "button button-primary ready-build-buy";
          buyButton.dataset.addToCart = build.id;
          buyButton.textContent = "Kúpiť";
          buyButton.setAttribute("aria-label", `Kúpiť: ${build.nazov}`);

          footer.append(price, stock);
          body.append(badge, title, description, details, footer, buyButton);
          card.append(image, body);
          buildGrid.append(card);
        });
    }

    renderReadyBuilds("vsetko");
    document.querySelectorAll("[data-filter]").forEach((filterButton) => {
      filterButton.addEventListener("click", () => {
        document.querySelectorAll("[data-filter]").forEach((button) => {
          const active = button === filterButton;
          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });
        renderReadyBuilds(filterButton.dataset.filter);
      });
    });
  }

  function initializeCartPage() {
    const cartContainer = document.getElementById("cart-items");
    const checkoutForm = document.getElementById("checkout-form");
    if (!cartContainer || !checkoutForm) return;

    const checkoutContent = document.getElementById("checkout-content");
    const emptyCart = document.getElementById("empty-cart");
    const itemCount = document.getElementById("cart-item-count");
    const subtotalElement = document.getElementById("cart-subtotal");
    const assemblyElement = document.getElementById("cart-assembly");
    const discountElement = document.getElementById("cart-discount");
    const discountHint = document.getElementById("discount-hint");
    const totalElement = document.getElementById("cart-total");
    const checkoutError = document.getElementById("checkout-error");
    const buyerInputs = [
      { input: document.getElementById("buyer-name"), message: "Zadajte meno a priezvisko." },
      { input: document.getElementById("buyer-email"), message: "Zadajte platnú e-mailovú adresu.", validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) },
      { input: document.getElementById("buyer-phone"), message: "Zadajte telefón v slovenskom tvare, napr. +421900123456 alebo 0900123456.", validate: (value) => /^(?:\+421[0-9]{9}|0[0-9]{9})$/.test(value.replace(/\s+/g, "")) },
      { input: document.getElementById("buyer-street"), message: "Zadajte ulicu a číslo." },
      { input: document.getElementById("buyer-city"), message: "Zadajte mesto." },
      { input: document.getElementById("buyer-postal-code"), message: "PSČ musí obsahovať presne 5 číslic.", validate: (value) => /^[0-9]{5}$/.test(value) }
    ];
    const icoInput = document.getElementById("company-ico");
    const dicInput = document.getElementById("company-dic");
    const paymentSelect = document.getElementById("payment-method");
    const termsCheckbox = document.getElementById("terms-consent");

    function currentCart() {
      return getCart().filter((item) => {
        const valid = item
          && typeof item.id === "string"
          && typeof item.nazov === "string"
          && Number.isFinite(Number(item.cena))
          && Number(item.cena) >= 0
          && Number.isFinite(Number(item.montaz))
          && Number(item.montaz) >= 0
          && Number.isInteger(Number(item.mnozstvo))
          && Number(item.mnozstvo) > 0;
        if (!valid) console.error("Neplatná položka v košíku bola vynechaná.", item);
        return valid;
      }).map((item) => ({
        ...item,
        cena: Number(item.cena),
        montaz: Number(item.montaz),
        mnozstvo: Number(item.mnozstvo)
      }));
    }

    function calculateTotals(cart) {
      const quantity = cart.reduce((sum, item) => sum + item.mnozstvo, 0);
      const subtotal = cart.reduce((sum, item) => sum + item.cena * item.mnozstvo, 0);
      const assembly = cart.reduce((sum, item) => sum + item.montaz * item.mnozstvo, 0);
      const discount = quantity >= 5 ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
      return {
        quantity,
        subtotal,
        assembly,
        discount,
        total: subtotal + assembly - discount
      };
    }

    function renderCart() {
      const cart = currentCart();
      const totals = calculateTotals(cart);
      cartContainer.replaceChildren();
      itemCount.textContent = `${totals.quantity} ${quantityNoun(totals.quantity)}`;

      cart.forEach((item) => {
        const row = document.createElement("article");
        row.className = "cart-item";

        const product = findProduct(item.id);
        const imageArea = document.createElement("div");
        imageArea.className = "cart-item-image";
        const image = document.createElement("img");
        image.src = product?.obrazok || "img/akcia1.jpg";
        image.alt = product?.alt || (product ? product.nazov : "Vlastná zostava počítača na mieru");
        imageArea.append(image);

        const details = document.createElement("div");
        details.className = "cart-item-details";
        const title = document.createElement("h3");
        title.textContent = item.nazov;
        const unitPrice = document.createElement("p");
        unitPrice.textContent = item.montaz > 0
          ? `${formatPrice(item.cena)} + ${formatPrice(item.montaz)} montáž`
          : `${formatPrice(item.cena)} za kus, montáž v cene`;
        details.append(title, unitPrice);
        if (Array.isArray(item.detail) && item.detail.length > 0) {
          const buildDetail = document.createElement("p");
          buildDetail.className = "cart-build-detail";
          buildDetail.textContent = item.detail.join(" · ");
          details.append(buildDetail);
        }

        const controls = document.createElement("div");
        controls.className = "quantity-controls";
        controls.setAttribute("aria-label", `Množstvo produktu ${item.nazov}`);
        const decrease = document.createElement("button");
        decrease.type = "button";
        decrease.className = "quantity-button";
        decrease.dataset.cartAction = "decrease";
        decrease.dataset.itemId = item.id;
        decrease.setAttribute("aria-label", `Znížiť množstvo: ${item.nazov}`);
        decrease.textContent = "−";
        const quantity = document.createElement("span");
        quantity.className = "quantity-value";
        quantity.textContent = String(item.mnozstvo);
        quantity.setAttribute("aria-live", "polite");
        const increase = document.createElement("button");
        increase.type = "button";
        increase.className = "quantity-button";
        increase.dataset.cartAction = "increase";
        increase.dataset.itemId = item.id;
        increase.setAttribute("aria-label", `Zvýšiť množstvo: ${item.nazov}`);
        increase.textContent = "+";
        controls.append(decrease, quantity, increase);

        const lineTotal = document.createElement("strong");
        lineTotal.className = "cart-line-total";
        lineTotal.textContent = formatPrice((item.cena + item.montaz) * item.mnozstvo);

        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "remove-item-button";
        remove.dataset.cartAction = "remove";
        remove.dataset.itemId = item.id;
        remove.textContent = "Odstrániť";
        remove.setAttribute("aria-label", `Odstrániť z košíka: ${item.nazov}`);

        row.append(imageArea, details, controls, lineTotal, remove);
        cartContainer.append(row);
      });

      checkoutContent.hidden = cart.length === 0;
      emptyCart.hidden = cart.length !== 0;
      subtotalElement.textContent = formatPrice(totals.subtotal);
      assemblyElement.textContent = formatPrice(totals.assembly);
      discountElement.textContent = totals.discount > 0 ? `−${formatPrice(totals.discount)}` : formatPrice(0);
      totalElement.textContent = formatPrice(totals.total);
      const missingForDiscount = 5 - totals.quantity;
      discountHint.textContent = totals.quantity >= 5
        ? "Množstevná zľava 10 % bola odpočítaná."
        : `Do zľavy 10 % vám chýba ${missingForDiscount} ${quantityNoun(missingForDiscount)}.`;
      updateCartCount();
      return { cart, totals };
    }

    cartContainer.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cart-action]");
      if (!button) return;

      const action = button.dataset.cartAction;
      const itemId = button.dataset.itemId;
      const cart = currentCart();
      const item = cart.find((entry) => entry.id === itemId);
      if (!item) return;

      let updated;
      if (action === "remove") {
        updated = cart.filter((entry) => entry.id !== itemId);
      } else {
        updated = cart.map((entry) => {
          if (entry.id !== itemId) return entry;
          const change = action === "increase" ? 1 : -1;
          return { ...entry, mnozstvo: Math.max(1, entry.mnozstvo + change) };
        });
      }

      if (writeStorage(cartKey, updated)) renderCart();
    });

    function setError(input, errorElement, message) {
      errorElement.textContent = message;
      input.setAttribute("aria-invalid", message ? "true" : "false");
    }

    checkoutForm.addEventListener("submit", (event) => {
      event.preventDefault();
      checkoutError.hidden = true;
      checkoutError.textContent = "";

      const ico = icoInput.value.trim();
      const dic = dicInput.value.trim();
      const payment = paymentSelect.value;
      const icoError = document.getElementById("ico-error");
      const dicError = document.getElementById("dic-error");
      const paymentError = document.getElementById("payment-error");
      const termsError = document.getElementById("terms-error");
      const errors = [];

      const invalidFields = [];
      buyerInputs.forEach(({ input, message, validate }) => {
        const value = input.value.trim();
        const valid = value && (!validate || validate(value));
        const errorElement = document.getElementById(`${input.id}-error`);
        setError(input, errorElement, valid ? "" : message);
        if (!valid) invalidFields.push(input);
      });

      setError(icoInput, icoError, ico && !/^[0-9]{8}$/.test(ico) ? "IČO musí obsahovať presne 8 číslic." : "");
      setError(dicInput, dicError, dic && !/^[0-9]{10}$/.test(dic) ? "DIČ musí obsahovať presne 10 číslic." : "");
      setError(paymentSelect, paymentError, payment ? "" : "Vyberte spôsob platby.");
      setError(termsCheckbox, termsError, termsCheckbox.checked ? "" : "Pre pokračovanie potvrďte súhlas s obchodnými podmienkami.");

      if (!payment) invalidFields.push(paymentSelect);
      if (ico && !/^[0-9]{8}$/.test(ico)) errors.push(icoError.textContent);
      if (dic && !/^[0-9]{10}$/.test(dic)) errors.push(dicError.textContent);
      if (!termsCheckbox.checked) invalidFields.push(termsCheckbox);
      if (invalidFields.length > 0) errors.push("Skontrolujte označené údaje.");

      const { cart, totals } = renderCart();
      if (cart.length === 0) {
        checkoutError.textContent = "Košík je prázdny. Vyberte si najprv zostavu alebo komponent.";
        checkoutError.hidden = false;
        return;
      }
      if (errors.length > 0) {
        checkoutError.textContent = "Skontrolujte označené údaje a vyplňte povinné polia.";
        checkoutError.hidden = false;
        const invalidField = [
          ...invalidFields,
          ...[icoInput, dicInput].filter((field) => field.getAttribute("aria-invalid") === "true")
        ][0];
        invalidField?.focus();
        return;
      }

      const date = new Date();
      const number = `PCNM-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      const order = {
        cislo: number,
        datum: date.toISOString(),
        polozky: cart.map(({ id, nazov, cena, montaz, mnozstvo }) => ({ id, nazov, cena, montaz, mnozstvo })),
        medzisucet: totals.subtotal,
        montaz: totals.assembly,
        zlava: totals.discount,
        celkom: totals.total,
        platba: payment,
        doprava: "Kuriér"
      };
      const previousOrders = readStorage("pcnm_objednavky", []);
      if (!Array.isArray(previousOrders)) {
        console.error("Údaje „pcnm_objednavky“ nemajú očakávaný formát zoznamu.");
        checkoutError.textContent = "Históriu objednávok sa nepodarilo načítať. Objednávka nebola zaznamenaná.";
        checkoutError.hidden = false;
        return;
      }
      if (!writeStorage("pcnm_objednavky", [...previousOrders, order])) return;
      if (!writeStorage(cartKey, [])) {
        checkoutError.textContent = "Objednávka bola zaznamenaná, ale košík sa nepodarilo vyprázdniť.";
        checkoutError.hidden = false;
        return;
      }
      window.location.href = `potvrdenie.html?cislo=${encodeURIComponent(number)}`;
    });

    [icoInput, dicInput].forEach((input) => {
      input.addEventListener("input", () => {
        const errorElement = document.getElementById(input.id === "company-ico" ? "ico-error" : "dic-error");
        setError(input, errorElement, "");
        checkoutError.hidden = true;
      });
    });
    paymentSelect.addEventListener("change", () => {
      setError(paymentSelect, document.getElementById("payment-error"), "");
      checkoutError.hidden = true;
    });
    [...buyerInputs.map(({ input }) => input), termsCheckbox].forEach((input) => {
      input.addEventListener(input === termsCheckbox ? "change" : "input", () => {
        const errorElement = document.getElementById(input === termsCheckbox ? "terms-error" : `${input.id}-error`);
        setError(input, errorElement, "");
        checkoutError.hidden = true;
      });
    });

    renderCart();
  }

  function initializeConfirmationPage() {
    const orderNumber = document.getElementById("confirmation-order-number");
    if (!orderNumber) return;

    const params = new URLSearchParams(window.location.search);
    const requestedNumber = params.get("cislo");
    const orders = readStorage("pcnm_objednavky", []);
    const error = document.getElementById("confirmation-error");
    const order = Array.isArray(orders)
      ? orders.find((entry) => entry.cislo === requestedNumber)
      : null;

    if (!order) {
      orderNumber.textContent = "Objednávka sa nenašla";
      error.textContent = "Potvrdenie sa nenašlo v tomto prehliadači. Objednávky sa ukladajú iba lokálne.";
      error.hidden = false;
      return;
    }

    orderNumber.textContent = order.cislo;
    document.getElementById("confirmation-date").textContent = new Intl.DateTimeFormat("sk-SK", {
      dateStyle: "long",
      timeStyle: "short"
    }).format(new Date(order.datum));

    const itemsContainer = document.getElementById("confirmation-items");
    order.polozky.forEach((item) => {
      const row = document.createElement("div");
      row.className = "confirmation-item";
      const label = document.createElement("span");
      label.textContent = `${item.nazov} × ${item.mnozstvo}`;
      const price = document.createElement("strong");
      price.textContent = formatPrice((item.cena + item.montaz) * item.mnozstvo);
      row.append(label, price);
      itemsContainer.append(row);
    });
    document.getElementById("confirmation-subtotal").textContent = formatPrice(order.medzisucet);
    document.getElementById("confirmation-assembly").textContent = formatPrice(order.montaz);
    document.getElementById("confirmation-discount").textContent = order.zlava > 0
      ? `−${formatPrice(order.zlava)}`
      : formatPrice(0);
    document.getElementById("confirmation-total").textContent = formatPrice(order.celkom);
  }

  function initializeAccountPage() {
    const savedBuildsList = document.getElementById("saved-builds-list");
    const ordersList = document.getElementById("orders-list");
    if (!savedBuildsList || !ordersList) return;

    function showEmptyState(container, message, linkText, href) {
      const emptyState = document.createElement("div");
      emptyState.className = "account-empty-state";
      const text = document.createElement("p");
      text.textContent = message;
      const link = document.createElement("a");
      link.className = "button button-secondary";
      link.href = href;
      link.textContent = linkText;
      emptyState.append(text, link);
      container.append(emptyState);
    }

    function renderSavedBuilds() {
      savedBuildsList.replaceChildren();
      const savedBuilds = readStorage(savedBuildsKey, []);
      if (!Array.isArray(savedBuilds)) {
        console.error(`Údaje „${savedBuildsKey}“ nemajú očakávaný formát zoznamu.`);
        showEmptyState(savedBuildsList, "Uložené zostavy sa nepodarilo načítať.", "Otvoriť konfigurátor", "konfigurator.html");
        return;
      }
      if (savedBuilds.length === 0) {
        showEmptyState(savedBuildsList, "Zatiaľ nemáte uloženú žiadnu zostavu. V konfigurátore si môžete zostavu vyskladať a uložiť.", "Otvoriť konfigurátor", "konfigurator.html");
        return;
      }

      savedBuilds.forEach((build) => {
        if (!build || typeof build.id !== "string") {
          console.error("Neplatná uložená zostava bola vynechaná.", build);
          return;
        }

        const card = document.createElement("article");
        card.className = "account-entry";
        const details = document.createElement("div");
        details.className = "account-entry-details";
        const title = document.createElement("h3");
        title.textContent = build.nazov || "Vlastná zostava";
        const description = document.createElement("p");
        description.textContent = "Procesor, základná doska a grafická karta";
        details.append(title, description);

        const actions = document.createElement("div");
        actions.className = "account-entry-actions";
        const loadLink = document.createElement("a");
        loadLink.className = "button button-primary";
        loadLink.href = `konfigurator.html?zostava=${encodeURIComponent(build.id)}`;
        loadLink.textContent = "Načítať do konfigurátora";

        const deleteButton = document.createElement("button");
        deleteButton.className = "button button-secondary";
        deleteButton.type = "button";
        deleteButton.dataset.deleteBuild = build.id;
        deleteButton.textContent = "Zmazať";
        actions.append(loadLink, deleteButton);
        card.append(details, actions);
        savedBuildsList.append(card);
      });
    }

    function reorderOrder(order) {
      if (!Array.isArray(order.polozky) || order.polozky.length === 0) {
        console.error(`Objednávka „${order.cislo}“ neobsahuje platné položky.`);
        window.alert("Položky tejto objednávky sa nepodarilo načítať.");
        return;
      }

      const cart = getCart().map((item) => ({ ...item }));
      for (const item of order.polozky) {
        if (!item || typeof item.id !== "string" || typeof item.nazov !== "string") {
          console.error(`Neplatná položka v objednávke „${order.cislo}“ nebola pridaná.`, item);
          window.alert("Niektoré položky tejto objednávky sa nepodarilo pridať do košíka.");
          return;
        }
        const quantity = Number(item.mnozstvo);
        const price = Number(item.cena);
        const assembly = Number(item.montaz);
        if (
          !Number.isFinite(quantity)
          || quantity < 1
          || !Number.isFinite(price)
          || price < 0
          || !Number.isFinite(assembly)
          || assembly < 0
        ) {
          console.error(`Neplatná položka v objednávke „${order.cislo}“ nebola pridaná.`, item);
          window.alert("Niektoré položky tejto objednávky sa nepodarilo pridať do košíka.");
          return;
        }

        const existing = cart.find((entry) => entry.id === item.id);
        if (existing) {
          existing.nazov = item.nazov;
          existing.cena = price;
          existing.montaz = assembly;
          existing.mnozstvo = Math.max(1, Number(existing.mnozstvo) || 1) + quantity;
        } else {
          cart.push({
            id: item.id,
            nazov: item.nazov,
            cena: price,
            montaz: assembly,
            mnozstvo: quantity
          });
        }
      }

      if (writeStorage(cartKey, cart)) {
        updateCartCount();
        window.location.href = "kosik.html";
      }
    }

    savedBuildsList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-delete-build]");
      if (!button) return;

      const savedBuilds = readStorage(savedBuildsKey, []);
      if (!Array.isArray(savedBuilds)) {
        console.error(`Údaje „${savedBuildsKey}“ nemajú očakávaný formát zoznamu.`);
        return;
      }
      const updatedBuilds = savedBuilds.filter((build) => !build || build.id !== button.dataset.deleteBuild);
      if (writeStorage(savedBuildsKey, updatedBuilds)) renderSavedBuilds();
    });

    const orders = readStorage("pcnm_objednavky", []);
    if (!Array.isArray(orders)) {
      console.error("Údaje „pcnm_objednavky“ nemajú očakávaný formát zoznamu.");
      showEmptyState(ordersList, "Objednávky sa nepodarilo načítať.", "Prejsť do konfigurátora", "konfigurator.html");
    } else if (orders.length === 0) {
      showEmptyState(ordersList, "Zatiaľ nemáte žiadnu objednávku. Po dokončení objednávky sa zobrazí v tomto zozname.", "Pozrieť hotové zostavy", "konfigurator.html#hotove-riesenia");
    } else {
      [...orders].reverse().forEach((order) => {
        if (!order || typeof order.cislo !== "string" || !Array.isArray(order.polozky)) {
          console.error("Neplatná objednávka bola vynechaná.", order);
          return;
        }

        const card = document.createElement("article");
        card.className = "account-entry order-entry";
        const details = document.createElement("div");
        details.className = "account-entry-details";
        const title = document.createElement("h3");
        title.textContent = `Objednávka ${order.cislo}`;
        const date = document.createElement("p");
        const parsedDate = new Date(order.datum);
        date.textContent = Number.isNaN(parsedDate.getTime())
          ? "Dátum neuvedený"
          : new Intl.DateTimeFormat("sk-SK", { dateStyle: "medium" }).format(parsedDate);

        const itemsList = document.createElement("ul");
        itemsList.className = "order-items-list";
        order.polozky.forEach((item) => {
          if (!item || typeof item.nazov !== "string") {
            console.error(`Neplatná položka v objednávke „${order.cislo}“ bola vynechaná.`, item);
            return;
          }
          const listItem = document.createElement("li");
          listItem.textContent = `${item.nazov} × ${Number(item.mnozstvo) || 0}`;
          itemsList.append(listItem);
        });
        const total = document.createElement("strong");
        total.className = "account-order-total";
        total.textContent = `Celkom: ${formatPrice(Number(order.celkom) || 0)}`;
        details.append(title, date, itemsList, total);

        const actions = document.createElement("div");
        actions.className = "account-entry-actions";
        const reorderButton = document.createElement("button");
        reorderButton.className = "button button-primary";
        reorderButton.type = "button";
        reorderButton.textContent = "Kúpiť znova";
        reorderButton.addEventListener("click", () => reorderOrder(order));
        actions.append(reorderButton);
        card.append(details, actions);
        ordersList.append(card);
      });
    }

    renderSavedBuilds();
  }

  if (!products) {
    console.error("Katalóg produktov sa nenačítal. Skontrolujte cestu k data/produkty.js.");
    return;
  }

  updateCartCount();
  window.addEventListener("storage", (event) => {
    if (event.key === cartKey) updateCartCount();
  });
  document.addEventListener("click", handleBuyClick);
  initializeHomeDeals();
  initializeReviews();
  initializeConfigurator();
  initializeCartPage();
  initializeConfirmationPage();
  initializeAccountPage();
})();
