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

    const processorSelect = document.getElementById("processor-select");
    const motherboardSelect = document.getElementById("motherboard-select");
    const graphicsCardSelect = document.getElementById("graphics-card-select");
    const compatibilityMessage = document.getElementById("compatibility-message");
    const partsPrice = document.getElementById("parts-price");
    const assemblyPrice = document.getElementById("assembly-price");
    const buildTotal = document.getElementById("build-total");
    const saveMessage = document.getElementById("saved-build-message");
    const saveButton = document.getElementById("save-build");
    const purchaseButton = document.getElementById("add-custom-build");

    function populateSelect(select, items, placeholder) {
      select.replaceChildren();
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = placeholder;
      emptyOption.disabled = true;
      select.append(emptyOption);

      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.nazov} — ${formatPrice(item.cena)}`;
        select.append(option);
      });
      select.value = items[0]?.id || "";
    }

    populateSelect(processorSelect, products.processors, "Vyberte procesor");
    populateSelect(motherboardSelect, products.motherboards, "Vyberte základnú dosku");
    populateSelect(graphicsCardSelect, products.graphicsCards, "Vyberte grafickú kartu");

    function selectedComponents() {
      return {
        processor: products.processors.find((item) => item.id === processorSelect.value),
        motherboard: products.motherboards.find((item) => item.id === motherboardSelect.value),
        graphicsCard: products.graphicsCards.find((item) => item.id === graphicsCardSelect.value)
      };
    }

    function currentSelection() {
      return {
        processorId: processorSelect.value,
        motherboardId: motherboardSelect.value,
        graphicsCardId: graphicsCardSelect.value
      };
    }

    function updateBuildSummary() {
      const selection = selectedComponents();
      const complete = selection.processor && selection.motherboard && selection.graphicsCard;
      const compatible = complete && selection.processor.socket === selection.motherboard.socket;
      const parts = complete
        ? selection.processor.cena + selection.motherboard.cena + selection.graphicsCard.cena
        : 0;
      const assembly = products.customBuild.montaz;

      partsPrice.textContent = formatPrice(parts);
      assemblyPrice.textContent = formatPrice(assembly);
      buildTotal.textContent = formatPrice(parts + assembly);
      compatibilityMessage.textContent = compatible
        ? "Všetky vybrané diely k sebe 100 % pasujú"
        : "Procesor a doska nie sú kompatibilné";
      compatibilityMessage.classList.toggle("is-compatible", Boolean(compatible));
      compatibilityMessage.classList.toggle("is-incompatible", !compatible);
      purchaseButton.disabled = !compatible;
      return { selection, compatible, parts };
    }

    const savedBuilds = readStorage(savedBuildsKey, []);
    if (Array.isArray(savedBuilds) && savedBuilds.length > 0) {
      const lastSaved = savedBuilds[savedBuilds.length - 1];
      if (products.processors.some((item) => item.id === lastSaved.processorId)) {
        processorSelect.value = lastSaved.processorId;
      }
      if (products.motherboards.some((item) => item.id === lastSaved.motherboardId)) {
        motherboardSelect.value = lastSaved.motherboardId;
      }
      if (products.graphicsCards.some((item) => item.id === lastSaved.graphicsCardId)) {
        graphicsCardSelect.value = lastSaved.graphicsCardId;
      }
    } else if (savedBuilds !== null && !Array.isArray(savedBuilds)) {
      console.error(`Údaje „${savedBuildsKey}“ nemajú očakávaný formát zoznamu.`);
    }

    [processorSelect, motherboardSelect, graphicsCardSelect].forEach((select) => {
      select.addEventListener("change", () => {
        saveMessage.textContent = "";
        updateBuildSummary();
      });
    });
    updateBuildSummary();

    saveButton.addEventListener("click", () => {
      const components = selectedComponents();
      if (!components.processor || !components.motherboard || !components.graphicsCard) return;

      const selection = currentSelection();
      const currentSavedBuilds = readStorage(savedBuildsKey, []);
      const saved = Array.isArray(currentSavedBuilds) ? currentSavedBuilds : [];
      const id = `vlastna-${selection.processorId}-${selection.motherboardId}-${selection.graphicsCardId}`;
      const name = `${components.processor.nazov}, ${components.motherboard.nazov}, ${components.graphicsCard.nazov}`;
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

      const { processor, motherboard, graphicsCard } = summary.selection;
      const id = `vlastna-${processor.id}-${motherboard.id}-${graphicsCard.id}`;
      const added = addToCart({
        id,
        nazov: `Vlastná zostava: ${processor.nazov}, ${motherboard.nazov}, ${graphicsCard.nazov}`,
        cena: summary.parts,
        montaz: products.customBuild.montaz,
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

  if (!products) {
    console.error("Katalóg produktov sa nenačítal. Skontrolujte cestu k data/produkty.js.");
    return;
  }

  updateCartCount();
  document.addEventListener("click", handleBuyClick);
  initializeHomeDeals();
  initializeConfigurator();
})();
