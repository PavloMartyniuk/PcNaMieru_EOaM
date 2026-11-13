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
    const icoInput = document.getElementById("company-ico");
    const dicInput = document.getElementById("company-dic");
    const paymentSelect = document.getElementById("payment-method");

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
      const errors = [];

      setError(icoInput, icoError, ico && !/^[0-9]{8}$/.test(ico) ? "IČO musí obsahovať presne 8 číslic." : "");
      setError(dicInput, dicError, dic && !/^[0-9]{10}$/.test(dic) ? "DIČ musí obsahovať presne 10 číslic." : "");
      setError(paymentSelect, paymentError, payment ? "" : "Vyberte spôsob platby.");

      if (ico && !/^[0-9]{8}$/.test(ico)) errors.push(icoError.textContent);
      if (dic && !/^[0-9]{10}$/.test(dic)) errors.push(dicError.textContent);
      if (!payment) errors.push(paymentError.textContent);

      const { cart, totals } = renderCart();
      if (cart.length === 0) {
        checkoutError.textContent = "Košík je prázdny. Vyberte si najprv zostavu alebo komponent.";
        checkoutError.hidden = false;
        return;
      }
      if (errors.length > 0) {
        checkoutError.textContent = "Skontrolujte označené údaje a vyberte spôsob platby.";
        checkoutError.hidden = false;
        const invalidField = [icoInput, dicInput, paymentSelect].find((field) => field.getAttribute("aria-invalid") === "true");
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
  initializeConfigurator();
  initializeCartPage();
  initializeConfirmationPage();
})();
