(function () {
  const data = window.ABCENTRUM;
  const page = document.body.dataset.page;
  const storageKey = "abcentrum:favoriteLots";
  const objectById = Object.fromEntries(data.objects.map((item) => [item.id, item]));
  const objectLocations = {
    mitino: { lat: 55.849145, lng: 37.340891 },
    nekrasovka: { lat: 55.676544, lng: 37.930757 },
    grekova: { lat: 55.888667, lng: 37.661722 }
  };

  const objectMetro = {
    mitino: { station: "Митино", time: "~7 мин пешком", color: "#446DAC" },
    nekrasovka: { station: "Некрасовка", time: "~12 мин пешком", color: "#D38EB0" },
    grekova: { station: "Медведково", time: "~5 мин пешком", color: "#DF823E" }
  };
  const featuredIds = ["B37A-04", "B37A-07", "NKR-ALL-R", "NKR-SALE-01", "GRK-ALL-R", "GRK-SALE-01"];
  let filters = {};
  let revealObserver = null;

  const formats = [
    ["all", "Все форматы"],
    ["industrial", "Light industrial"],
    ["mezzanine", "Мезонин"],
    ["office", "Офисы"],
    ["showroom", "Showroom"],
    ["food", "Общепит"],
    ["medical", "Медицинский центр"],
    ["retail", "Street retail"],
    ["service", "Сервис"]
  ];

  const purposes = [
    ["all", "Любое"],
    ["офис", "Офис"],
    ["производство", "Производство"],
    ["light industrial", "Light industrial"],
    ["общепит", "Общепит"],
    ["showroom", "Showroom"],
    ["мезонин", "Мезонин"],
    ["медицин", "Медицинский оператор"],
    ["сервис", "Сервис"],
    ["инвести", "Инвестиционный сценарий"]
  ];

  const floors = ["all", "-1", "1", "2", "3", "4", "антресоль", "-1 + 1 + 2 + 3", "-1 + 1 + антресоль + 2", "3 + 1"];

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    renderHeader();
    renderFooter();
    renderRequestModal();
    renderContactLinks();
    bindGlobalClicks();
    bindKeyboard();
    initHeaderState();
    initScrollProgress();

    if (page === "home") renderHome();
    if (page === "catalog") renderCatalog();
    if (page === "object") renderObjectPage();

    markActiveNavigation();
    applyFormatLabels();
    updateFavoriteCount();
    initMotion();
    initPageTransitions();
    requestAnimationFrame(() => document.body.classList.add("is-ready"));
  }

  function renderHeader() {
    const header = document.querySelector("[data-header]");
    if (!header) return;
    header.innerHTML = `
      <a class="brand" href="index.html" aria-label="ABCENTRUM">
        <img src="assets/logo.svg" alt="ABCENTRUM">
      </a>
      <nav class="nav-links" aria-label="Основная навигация">
        <a href="index.html">Главная</a>
        <a href="index.html#objects">Объекты</a>
        <a href="lots.html">Каталог</a>
        <a href="lots.html?deal=buy&object=nekrasovka,grekova">Покупка</a>
        <a href="index.html#map">Карта</a>
        <a href="index.html#contacts">Контакты</a>
      </nav>
      <div class="header-contacts">
        <span class="mobile-menu-label">Контакты</span>
        <a href="${data.contacts.phoneHref}">${data.contacts.phone}</a>
        <a href="${data.contacts.telegramHref}" aria-label="Telegram ABCENTRUM"><span class="desktop-telegram-icon"><img class="telegram-icon" src="assets/telegram.svg" alt=""></span><span class="mobile-telegram-label">${data.contacts.telegram}</span></a>
        <a class="fav-link" href="lots.html?favorites=1" aria-label="Избранное"><span class="fav-link-heart" aria-hidden="true">♡</span><span data-fav-count>0</span></a>
        <button class="btn btn-ghost" type="button" data-open-request data-context="Быстрый запрос из шапки">Оставить заявку</button>
      </div>
      <a class="fav-link mobile-fav-link" href="lots.html?favorites=1" aria-label="Избранное"><span class="fav-link-heart" aria-hidden="true">♡</span><span data-fav-count>0</span></a>
      <button class="menu-toggle" type="button" data-menu-toggle aria-label="Открыть меню" aria-expanded="false"><span class="menu-toggle-line" aria-hidden="true"></span><span class="menu-toggle-line" aria-hidden="true"></span><span class="menu-toggle-line" aria-hidden="true"></span></button>
    `;
  }

  function renderFooter() {
    const footer = document.querySelector("[data-footer]");
    if (!footer) return;
    footer.innerHTML = `
      <div>
        <img src="assets/logo.svg" alt="ABCENTRUM">
        <p>ABCENTRUM — коммерческая недвижимость для производства, light industrial, офисов, клиентских форматов и медицинских операторов.</p>
        <p>© ABCENTRUM. Коммерческая недвижимость для бизнеса.</p>
      </div>
      <div><h3>Навигация</h3><a href="index.html">Главная</a><a href="index.html#objects">Объекты</a><a href="index.html#map">Карта</a><a href="lots.html">Каталог</a><a href="index.html#trust">Документы</a><a href="lots.html?deal=buy&object=nekrasovka,grekova">Покупка</a><a href="index.html#contacts">Контакты</a></div>
      <div><h3>Объекты</h3><a href="mitino.html">Промтехнопарк «Митино»</a><a href="nekrasovka.html">Промтехнопарк «Некрасовка»</a><a href="grekova.html">Медицинский центр «Грекова»</a></div>
      <div><h3>Каталог</h3><a href="lots.html">Все помещения</a><a href="lots.html?deal=rent">Аренда</a><a href="lots.html?deal=buy&object=nekrasovka,grekova">Покупка</a><a href="lots.html?favorites=1">Избранное</a></div>
      <div><h3>Контакты</h3><a href="${data.contacts.phoneHref}">${data.contacts.phone}</a><a href="${data.contacts.emailHref}">${data.contacts.email}</a><a href="${data.contacts.telegramHref}">${data.contacts.telegram}</a></div>
    `;
  }

  function renderHome() {
    renderHomeSearch();
    renderObjects();
    renderObjectsMap();
    renderFormats();
    renderFeaturedLots();
    renderFaq();
    initHeroRotation();
  }

  function renderHeroFormatOrb() {
    const target = document.querySelector("[data-format-orb]");
    if (!target) return;

    const grouped = data.lots
      .filter((lot) => lot.status === "available" && lot.deal === "rent")
      .reduce((acc, lot) => {
        const category = ["industrial", "mezzanine"].includes(lot.category)
          ? "production"
          : ["office", "service"].includes(lot.category)
            ? "office"
            : "client";
        acc[category] = (acc[category] || 0) + Number(lot.area || 0);
        return acc;
      }, {});

    const items = [
      { key: "production", label: "Производство / склад", area: grouped.production || 0, color: "rgba(108, 164, 200, 0.60)" },
      { key: "office", label: "Офис / админ. блок", area: grouped.office || 0, color: "rgba(232, 143, 78, 0.60)" },
      { key: "client", label: "Клиентские форматы", area: grouped.client || 0, color: "rgba(112, 166, 118, 0.60)" }
    ];

    const total = items.reduce((sum, item) => sum + item.area, 0) || 1;
    let cursor = 0;
    const stops = [];
    items.forEach((item, index) => {
      const arc = (item.area / total) * 360;
      const startDeg = cursor;
      const endDeg = cursor + arc;
      const boundary = index === items.length - 1 ? endDeg : Math.max(startDeg, endDeg - 1.2);
      stops.push(`${item.color} ${startDeg.toFixed(2)}deg ${boundary.toFixed(2)}deg`);
      if (index !== items.length - 1) {
        stops.push(`rgba(255,255,255,0.72) ${boundary.toFixed(2)}deg ${endDeg.toFixed(2)}deg`);
      }
      cursor = endDeg;
    });

    const ariaText = items
      .map((item) => `${item.label}: ${Math.round((item.area / total) * 100)}%`)
      .join(", ");

    target.innerHTML = `
      <div class="format-orb-chart" role="img" aria-label="Структура форматов помещений: ${ariaText}">
        <div class="format-orb-ring" style="background: conic-gradient(from -90deg, ${stops.join(', ')});"></div>
      </div>
    `;
  }

  function renderHomeSearch() {
    const target = document.querySelector("[data-home-search]");
    if (!target) return;
    const areaConfig = { min: 0, max: 6000, step: 10, startMin: 0, startMax: 6000 };
    target.innerHTML = `
      <div class="search-topline">
        <div class="search-tabs segmented" data-home-deal>
          <button class="is-active" data-value="rent" type="button">Аренда</button>
          <button data-value="buy" type="button">Покупка</button>
        </div>
        <div class="area-range-inline" data-area-range aria-label="Диапазон площади">
          <div class="range-slider range-slider--compact" style="--range-start:0%; --range-end:100%;">
            <div class="range-value range-value--min" data-area-min-label>0 м²</div>
            <div class="range-value range-value--max" data-area-max-label>6000 м²</div>
            <div class="range-slider-track"></div>
            <div class="range-slider-active"></div>
            <input data-area-range-min type="range" min="${areaConfig.min}" max="${areaConfig.max}" step="${areaConfig.step}" value="${areaConfig.startMin}" aria-label="Минимальная площадь">
            <input data-area-range-max type="range" min="${areaConfig.min}" max="${areaConfig.max}" step="${areaConfig.step}" value="${areaConfig.startMax}" aria-label="Максимальная площадь">
          </div>
        </div>
      </div>
      <div class="filter-row filter-row--search">
        <label class="field">Здание
          <select data-home-object>
            <option value="all">Все здания</option>
            <option value="mitino">Промтехнопарк «Митино»</option>
            <option value="nekrasovka">Некрасовка</option>
            <option value="grekova">Медицинский центр «Грекова»</option>
          </select>
        </label>
        <label class="field">Формат помещения
          <select data-home-format>${formats.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select>
        </label>
        <label class="field">Площадь от
          <input data-home-area-min type="number" min="0" max="6000" step="10" inputmode="numeric" placeholder="от 0 м²" value="${areaConfig.startMin}">
        </label>
        <label class="field">Площадь до
          <input data-home-area-max type="number" min="0" max="6000" step="10" inputmode="numeric" placeholder="до 6000 м²" value="${areaConfig.startMax}">
        </label>
        <button class="btn btn-primary" type="button" data-home-submit>Применить</button>
      </div>
      <p class="buy-note" data-home-note hidden>Промтехнопарк «Митино» сейчас доступен только в аренду. Для покупки выберите Промтехнопарк «Некрасовка» или Медицинский центр «Грекова».</p>
    `;

    const dealTabs = target.querySelectorAll("[data-home-deal] button");
    const objectSelect = target.querySelector("[data-home-object]");
    const minInput = target.querySelector("[data-home-area-min]");
    const maxInput = target.querySelector("[data-home-area-max]");
    const minRange = target.querySelector("[data-area-range-min]");
    const maxRange = target.querySelector("[data-area-range-max]");
    const rangeSlider = target.querySelector(".range-slider");
    const minGap = 50;

    function clampAreaValues(nextMin, nextMax, activeThumb) {
      let min = Number.isFinite(nextMin) ? nextMin : areaConfig.min;
      let max = Number.isFinite(nextMax) ? nextMax : areaConfig.max;
      min = Math.max(areaConfig.min, Math.min(min, areaConfig.max));
      max = Math.max(areaConfig.min, Math.min(max, areaConfig.max));

      if (max - min < minGap) {
        if (activeThumb === "min") min = Math.min(min, max - minGap);
        else max = Math.max(max, min + minGap);
      }

      min = Math.max(areaConfig.min, Math.min(min, areaConfig.max - minGap));
      max = Math.max(areaConfig.min + minGap, Math.min(max, areaConfig.max));
      return { min, max };
    }


    function paintRange(min, max) {
      const start = ((min - areaConfig.min) / (areaConfig.max - areaConfig.min)) * 100;
      const end = ((max - areaConfig.min) / (areaConfig.max - areaConfig.min)) * 100;
      rangeSlider.style.setProperty("--range-start", `${start}%`);
      rangeSlider.style.setProperty("--range-end", `${end}%`);
      const minLabel = target.querySelector("[data-area-min-label]");
      const maxLabel = target.querySelector("[data-area-max-label]");
      if (minLabel) {
        minLabel.textContent = `${min.toLocaleString("ru-RU")} м²`;
        minLabel.style.left = `${start}%`;
      }
      if (maxLabel) {
        maxLabel.textContent = `${max.toLocaleString("ru-RU")} м²`;
        maxLabel.style.left = `${end}%`;
      }
    }

    function syncAreaRange(source) {
      const values = clampAreaValues(Number(minInput.value || areaConfig.min), Number(maxInput.value || areaConfig.max), source);
      minInput.value = String(values.min);
      maxInput.value = String(values.max);
      minRange.value = String(values.min);
      maxRange.value = String(values.max);
      paintRange(values.min, values.max);
    }

    paintRange(areaConfig.startMin, areaConfig.startMax);

    minRange.addEventListener("input", () => {
      minInput.value = minRange.value;
      syncAreaRange("min");
    });

    maxRange.addEventListener("input", () => {
      maxInput.value = maxRange.value;
      syncAreaRange("max");
    });

    [minInput, maxInput].forEach((input) => {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^\d]/g, "");
        syncAreaRange(input === minInput ? "min" : "max");
      });
      input.addEventListener("blur", () => syncAreaRange(input === minInput ? "min" : "max"));
    });

    dealTabs.forEach((button) => {
      button.addEventListener("click", () => {
        dealTabs.forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        const isBuy = button.dataset.value === "buy";
        objectSelect.querySelector('option[value="mitino"]').disabled = isBuy;
        if (isBuy && objectSelect.value === "mitino") objectSelect.value = "nekrasovka";
        target.querySelector("[data-home-note]").hidden = !isBuy;
      });
    });

    target.querySelector("[data-home-submit]").addEventListener("click", () => {
      const deal = target.querySelector("[data-home-deal] .is-active").dataset.value;
      const object = objectSelect.value;
      const type = target.querySelector("[data-home-format]").value;
      const min = target.querySelector("[data-home-area-min]").value || "0";
      const max = target.querySelector("[data-home-area-max]").value || "6000";
      const params = new URLSearchParams({ deal, type, areaMin: min, areaMax: max });
      if (object !== "all") params.set("object", object);
      if (deal === "buy" && object === "all") params.set("object", "nekrasovka,grekova");
      window.location.href = `lots.html?${params.toString()}`;
    });
  }

  function renderObjects() {
    const target = document.querySelector("[data-objects-grid]");
    if (!target) return;
    target.innerHTML = data.objects.map((object) => `
      <article class="object-card reveal">
        <a class="object-media" href="${object.page}"><img src="${object.image}" alt="${object.title}" loading="lazy"></a>
        <div class="object-body">
          <p class="eyebrow">${object.deals.includes("buy") ? "Аренда · Покупка" : "Аренда"}</p>
          <h3>${object.title}</h3>
          <p>${object.description}</p>
          <ul class="metric-list">${object.metrics.slice(0, 5).map((item) => `<li>${item}</li>`).join("")}</ul>
        </div>
        <div class="object-actions">
          <a class="btn btn-light" href="${object.page}">Подробнее</a>
          <a class="btn btn-ghost" href="lots.html?deal=rent&object=${object.id}">Смотреть помещения</a>
          <a class="btn btn-ghost" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Маршрут</a>
        </div>
      </article>
    `).join("");
  }

  function renderObjectsMap() {
    const target = document.querySelector("[data-objects-map]");
    if (!target) return;
    const objects = getMapObjects();

    target.innerHTML = `
      <div class="map-viewport reveal" aria-label="Яндекс.Карта объектов ABCENTRUM">
        <div id="abcentrum-yandex-map" class="yandex-map" data-yandex-map></div>
        <a class="map-static-fallback" data-map-fallback href="${getYandexMapUrl(objects)}" target="_blank" rel="noopener noreferrer" hidden>
          <img src="${getYandexStaticMapUrl(objects)}" alt="Статичная карта объектов ABCENTRUM" loading="lazy">
          <span>Открыть объекты в Яндекс.Картах</span>
        </a>
      </div>
      <div class="map-object-list">
        ${objects.map((object) => `
          <article class="map-object-card reveal">
            <div>
              <p class="eyebrow">${object.deals.includes("buy") ? "Аренда · Покупка" : "Аренда"}</p>
              <h3>${object.title}</h3>
              <p>${object.address}</p>
              <div class="map-metro">${getMetroIcon(object.id)}<span>${getMetroText(object.id)}</span></div>
            </div>
            <div class="map-card-actions">
              <a class="btn btn-dark" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
              <a class="btn btn-light" href="${getYandexObjectUrl(object.id)}" target="_blank" rel="noopener noreferrer">Открыть карту</a>
            </div>
          </article>
        `).join("")}
      </div>
    `;

    requestAnimationFrame(() => initYandexObjectsMap(objects));
  }

  function getMapObjects() {
    return data.objects.map((object, index) => ({
      ...object,
      ...objectLocations[object.id],
      mapIndex: index + 1
    })).filter((object) => object.lat && object.lng);
  }

  function loadYandexMapsApi() {
    if (window.ymaps) return Promise.resolve(window.ymaps);
    if (window.__abcentrumYmapsPromise) return window.__abcentrumYmapsPromise;

    window.__abcentrumYmapsPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const apiKey = window.ABCENTRUM_YMAPS_API_KEY || "";
      const params = new URLSearchParams({ lang: "ru_RU" });
      if (apiKey) params.set("apikey", apiKey);
      script.src = `https://api-maps.yandex.ru/2.1/?${params.toString()}`;
      script.async = true;
      script.onload = () => window.ymaps ? window.ymaps.ready(() => resolve(window.ymaps)) : reject(new Error("Yandex Maps API is unavailable"));
      script.onerror = () => reject(new Error("Yandex Maps API failed to load"));
      document.head.appendChild(script);
    });

    return window.__abcentrumYmapsPromise;
  }

  function initYandexObjectsMap(objects = getMapObjects()) {
    const node = document.querySelector("[data-yandex-map]");
    if (!node || node.dataset.initialized === "true") return;
    const fallbackTimer = window.setTimeout(showMapFallback, 6500);

    loadYandexMapsApi()
      .then((ymaps) => {
        window.clearTimeout(fallbackTimer);
        node.dataset.initialized = "true";
        const map = new ymaps.Map(node, {
          center: [55.7856, 37.6409],
          zoom: window.matchMedia("(max-width: 760px)").matches ? 9 : 10,
          controls: ["zoomControl", "fullscreenControl"]
        }, {
          suppressMapOpenBlock: true,
          yandexMapDisablePoiInteractivity: true
        });

        const collection = new ymaps.GeoObjectCollection(null, {
          preset: "islands#circleDotIcon",
          iconColor: "#b3261b"
        });

        objects.forEach((object) => {
          const placemark = new ymaps.Placemark([object.lat, object.lng], {
            hintContent: object.title,
            balloonContentHeader: object.title,
            balloonContentBody: `
              <div class="ymap-balloon">
                <p>${object.address}</p>
                <p class="ymap-balloon-metro">${getMetroIcon(object.id)}<span>${getMetroText(object.id)}</span></p>
                <a href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
              </div>
            `
          }, {
            preset: "islands#circleDotIcon",
            iconColor: getMetroColor(object.id),
            hideIconOnBalloonOpen: false
          });
          collection.add(placemark);
        });

        map.geoObjects.add(collection);
        const bounds = collection.getBounds();
        if (bounds) map.setBounds(bounds, { checkZoomRange: true, zoomMargin: window.matchMedia("(max-width: 760px)").matches ? 44 : 72 });
      })
      .catch(showMapFallback);
  }

  function showMapFallback() {
    const fallback = document.querySelector("[data-map-fallback]");
    const node = document.querySelector("[data-yandex-map]");
    if (node) node.hidden = true;
    if (fallback) fallback.hidden = false;
  }

  function getMetroData(objectId) {
    return objectMetro[objectId] || { station: "Уточните ориентир у менеджера", time: "", color: "#b3261b" };
  }

  function getMetroText(objectId) {
    const metro = getMetroData(objectId);
    return metro.time ? `${metro.station} · ${metro.time}` : metro.station;
  }

  function getMetroColor(objectId) {
    return getMetroData(objectId).color;
  }

  function getMetroIcon() {
    return `<span class="metro-icon" aria-hidden="true"><img src="assets/Moscow_Metro.svg.svg" alt="" width="18" height="18"></span>`;
  }

  function getYandexMapUrl(objects) {
    const center = { lat: 55.7856, lng: 37.6409 };
    const zoom = window.matchMedia("(max-width: 760px)").matches ? 9 : 10;
    const points = objects.map((object) => {
      const color = object.id === "mitino" ? "rd" : object.id === "nekrasovka" ? "rd" : "rd";
      return `${object.lng},${object.lat},pm2${color}m${object.mapIndex}`;
    }).join("~");
    const params = new URLSearchParams({
      l: "map",
      ll: `${center.lng},${center.lat}`,
      z: String(zoom),
      pt: points
    });
    return `https://yandex.ru/maps/?${params.toString()}`;
  }

  function getYandexStaticMapUrl(objects) {
    const params = new URLSearchParams({
      l: "map",
      ll: "37.6409,55.7856",
      z: "10",
      size: "650,420",
      pt: objects.map((object) => `${object.lng},${object.lat},pm2rdm${object.mapIndex}`).join("~")
    });
    return `https://static-maps.yandex.ru/1.x/?${params.toString()}`;
  }

  function getYandexObjectUrl(objectId) {
    const point = objectLocations[objectId];
    if (!point) return "https://yandex.ru/maps/";
    const params = new URLSearchParams({
      l: "map",
      z: "17",
      ll: `${point.lng},${point.lat}`,
      pt: `${point.lng},${point.lat},pm2rdm`
    });
    return `https://yandex.ru/maps/?${params.toString()}`;
  }

  function getRouteUrl(objectId) {
    const point = objectLocations[objectId];
    if (!point) return "https://yandex.ru/maps/";
    const params = new URLSearchParams({
      rtext: `~${point.lat},${point.lng}`,
      rtt: "auto"
    });
    return `https://yandex.ru/maps/?${params.toString()}`;
  }

  function renderFormats() {
    const items = [
      ["Light industrial / производство", "Площади под производство, сервис и складские операции с понятной логистикой."],
      ["Офисы и административные блоки", "Офисные помещения внутри объектов для back-office, штаб-квартиры или команды проекта."],
      ["Клиентские форматы", "Showroom, street retail, общепит и входные группы для сценариев с посетительским трафиком."],
      ["Медицинский центр", "Отдельный медицинский объект на Грекова для клиники, реабилитации или доходного актива."],
      ["Здание целиком", "Покупка доступна только по Некрасовке и Грекова, без дробления на отдельные этажи."]
    ];
    const target = document.querySelector("[data-formats]");
    if (target) target.innerHTML = items.map(([title, text]) => `<article class="feature-card reveal"><h3>${title}</h3><p>${text}</p></article>`).join("");
  }

  function renderFeaturedLots() {
    const target = document.querySelector("[data-featured-lots]");
    if (!target) return;
    target.innerHTML = featuredIds.map((id) => lotCard(data.lots.find((lot) => lot.id === id))).join("");
  }

  function renderProcess() {
    const steps = [
      ["Выбрать сценарий", "Определите сделку: аренда помещения или покупка здания целиком."],
      ["Отфильтровать каталог", "Выберите объект, формат, площадь, этаж, цену или ставку, статус и назначение."],
      ["Сравнить предложения", "Сопоставьте площадь, этаж, потолки, состояние передачи, назначение и условия."],
      ["Открыть карточку помещения", "Посмотрите подробности, планировку, сценарии использования и условия сделки."],
      ["Сохранить интересное", "Добавьте помещения в избранное, чтобы вернуться к ним после сравнения."],
      ["Отправить заявку", "Запросите просмотр, подбор или инвестиционное предложение через форму связи."]
    ];
    const target = document.querySelector("[data-process]");
    if (target) target.innerHTML = steps.map(([title, text], index) => `<article class="timeline-item reveal"><span class="timeline-number">0${index + 1}</span><h3>${title}</h3><p>${text}</p></article>`).join("");
  }

  function renderFaq() {
    const clientFaq = [
      ["Какой минимальный срок аренды?", "От 11 месяцев. Для отдельных форматов возможен краткосрочный договор — уточняйте у менеджера."],
      ["Входит ли отделка в арендную ставку?", "Нет. Помещения сдаются в состоянии Shell & Core. Fit-out обсуждается отдельно, возможна арендная каникула на период ремонта."],
      ["Есть ли парковка?", "Да, на всех объектах предусмотрена парковка для арендаторов. Количество мест зависит от площади арендуемого блока."],
      ["Что входит в ставку и что оплачивается отдельно?", "Ставка — за площадь. Отдельно: OPEX (эксплуатация), коммунальные платежи, НДС 20%. Подробный расчёт менеджер пришлёт после заявки."],
      ["Можно ли арендовать часть этажа?", "В Митино — да, доступно 7 блоков от ~430 м². В Некрасовке и Грекова — только здание целиком."],
      ["Как проходит сделка купли-продажи?", "Через ПДКП (предварительный договор) или ДКПБВ (договор купли-продажи будущей вещи). Пакет документов высылается после заявки."]
    ];
    const siteFaq = [
      ["Как работает избранное?", "ID помещений сохраняются в браузере. Их можно открыть в каталоге, сравнить и передать менеджеру в заявке."],
      ["Почему Митино не отображается при покупке?", "Митино сейчас доступен только в аренду, поэтому в режиме покупки показываются Некрасовка и Грекова."]
    ];
    const target = document.querySelector("[data-faq]");
    if (!target) return;
    const item = ([question, answer], index, prefix = "faq") => `
      <article class="faq-item ${index === 0 && prefix === "faq" ? "is-open" : ""}">
        <button type="button" aria-expanded="${index === 0 && prefix === "faq" ? "true" : "false"}">${question}</button>
        <div class="faq-answer"><p>${answer}</p></div>
      </article>
    `;
    target.innerHTML = `
      ${clientFaq.map((entry, index) => item(entry, index)).join("")}
      <div class="faq-subgroup">
        <h3>Вопросы о сайте</h3>
        ${siteFaq.map((entry, index) => item(entry, index, "site")).join("")}
      </div>
    `;
    target.querySelectorAll(".faq-item button").forEach((button) => {
      button.addEventListener("click", () => {
        const current = button.closest(".faq-item");
        const isOpen = current.classList.contains("is-open");
        target.querySelectorAll(".faq-item").forEach((item) => {
          item.classList.remove("is-open");
          item.querySelector("button")?.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          current.classList.add("is-open");
          button.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  function renderCatalog() {
    filters = getInitialFilters();
    renderFilters();
    bindFilterInputs();
    renderCatalogLots();
  }

  function getInitialFilters() {
    const params = new URLSearchParams(window.location.search);
    return {
      q: params.get("q") || "",
      deal: params.get("deal") || "rent",
      object: params.get("object") || "all",
      type: params.get("type") || "all",
      areaMin: params.get("areaMin") || "",
      areaMax: params.get("areaMax") || "",
      priceMin: params.get("priceMin") || "",
      priceMax: params.get("priceMax") || "",
      floor: params.get("floor") || "all",
      wholeOnly: params.get("wholeOnly") === "1",
      favorites: params.get("favorites") === "1",
      sort: params.get("sort") || "recommended"
    };
  }

  function renderFilters() {
    const target = document.querySelector("[data-filters]");
    if (!target) return;
    const isBuy = filters.deal === "buy";
    const priceLabel = isBuy ? "Цена покупки, ₽/м²" : "Ставка аренды, ₽/м²/год";
    const objectOptions = isBuy
      ? [["all", "Покупка зданий"], ["nekrasovka", "Промтехнопарк «Некрасовка»"], ["grekova", "Медицинский центр «Грекова»"]]
      : [["all", "Все объекты"], ["mitino", "Промтехнопарк «Митино»"], ["nekrasovka", "Промтехнопарк «Некрасовка»"], ["grekova", "Медицинский центр «Грекова»"]];
    if (isBuy && filters.object === "mitino") filters.object = "all";
    target.innerHTML = `
      <div class="filters-title"><h2>Подбор</h2><button class="btn btn-dark" type="button" data-close-filters>Закрыть</button></div>
      <div class="catalog-mode segmented" data-catalog-mode>
        <button class="${filters.deal === "rent" ? "is-active" : ""}" data-deal-mode="rent" type="button">Аренда</button>
        <button class="${filters.deal === "buy" ? "is-active" : ""}" data-deal-mode="buy" type="button">Покупка</button>
      </div>
      <p class="filter-help">${isBuy ? "Покупка доступна только зданиями целиком." : "Аренда доступна блоками или зданием целиком."}</p>
      <label class="field">Поиск
        <input data-filter="q" type="search" placeholder="ID, объект, формат" value="${filters.q}">
      </label>
      ${selectField("object", "Объект", objectOptions, filters.object)}
      ${selectField("type", "Формат", formats, filters.type)}
      <div class="catalog-area-range" data-catalog-area-range>
        <div class="range-slider" style="--range-start:0%; --range-end:100%;">
          <div class="range-value range-value--min" data-catalog-area-min-label>${filters.areaMin || 0} м²</div>
          <div class="range-value range-value--max" data-catalog-area-max-label>${filters.areaMax || 6000} м²</div>
          <div class="range-slider-track"></div>
          <div class="range-slider-active"></div>
          <input data-catalog-area-min type="range" min="0" max="6000" step="10" value="${filters.areaMin || 0}" aria-label="Минимальная площадь">
          <input data-catalog-area-max type="range" min="0" max="6000" step="10" value="${filters.areaMax || 6000}" aria-label="Максимальная площадь">
        </div>
      </div>
      <div class="filter-row">
        <label class="field">Площадь от<input data-filter="areaMin" type="number" min="0" max="6000" step="10" inputmode="numeric" placeholder="от 0 м²" value="${filters.areaMin}"></label>
        <label class="field">Площадь до<input data-filter="areaMax" type="number" min="0" max="6000" step="10" inputmode="numeric" placeholder="до 6000 м²" value="${filters.areaMax}"></label>
      </div>
      <div class="filter-row">
        <label class="field">${priceLabel} от<input data-filter="priceMin" type="number" value="${filters.priceMin}"></label>
        <label class="field">${priceLabel} до<input data-filter="priceMax" type="number" value="${filters.priceMax}"></label>
      </div>
      ${!isBuy ? selectField("floor", "Этаж", floors.map((floor) => [floor, floor === "all" ? "Все этажи" : floor]), filters.floor) : ""}
      <label class="checkbox-field"><input data-filter="wholeOnly" type="checkbox" ${filters.wholeOnly ? "checked" : ""}> Только здание целиком</label>
      <label class="checkbox-field"><input data-filter="favorites" type="checkbox" ${filters.favorites ? "checked" : ""}> Только избранные</label>
      <button class="btn btn-dark" type="button" data-reset-filters>Сбросить фильтры</button>
    `;
  }

  function selectField(name, label, options, value) {
    return `<label class="field">${label}<select data-filter="${name}">${options.map(([optionValue, optionLabel]) => `<option value="${optionValue}" ${optionValue === value ? "selected" : ""}>${optionLabel}</option>`).join("")}</select></label>`;
  }

  function bindFilterInputs() {
    document.querySelectorAll("[data-filter]").forEach((input) => {
      if (["areaMin", "areaMax"].includes(input.dataset.filter)) return;
      input.addEventListener("input", onFilterChange);
      input.addEventListener("change", onFilterChange);
    });
    document.querySelectorAll("[data-deal-mode]").forEach((button) => {
      button.addEventListener("click", () => {
        filters.deal = button.dataset.dealMode;
        filters.priceMin = "";
        filters.priceMax = "";
        filters.floor = "all";
        if (filters.deal === "buy") {
          filters.object = filters.object === "mitino" ? "all" : filters.object;
          filters.wholeOnly = true;
        }
        renderFilters();
        bindFilterInputs();
        renderCatalogLots();
      });
    });
    initCatalogAreaRange();
    document.querySelector("[data-toggle-filters]")?.addEventListener("click", () => document.querySelector("[data-filters]").classList.add("is-open"));
    document.querySelector("[data-close-filters]")?.addEventListener("click", () => document.querySelector("[data-filters]").classList.remove("is-open"));
    document.querySelector("[data-reset-filters]")?.addEventListener("click", resetFilters);
  }

  function initCatalogAreaRange() {
    const host = document.querySelector("[data-catalog-area-range]");
    if (!host) return;
    const slider = host.querySelector(".range-slider");
    const minRange = host.querySelector("[data-catalog-area-min]");
    const maxRange = host.querySelector("[data-catalog-area-max]");
    const minInput = document.querySelector('[data-filter="areaMin"]');
    const maxInput = document.querySelector('[data-filter="areaMax"]');
    const minLabel = host.querySelector("[data-catalog-area-min-label]");
    const maxLabel = host.querySelector("[data-catalog-area-max-label]");
    const config = { min: 0, max: 6000, gap: 50 };

    const clamp = (nextMin, nextMax, source) => {
      let min = Math.max(config.min, Math.min(Number(nextMin) || 0, config.max));
      let max = Math.max(config.min, Math.min(Number(nextMax) || config.max, config.max));
      if (max - min < config.gap) {
        if (source === "min") min = Math.max(config.min, max - config.gap);
        else max = Math.min(config.max, min + config.gap);
      }
      return { min, max };
    };

    const paint = (min, max) => {
      const start = ((min - config.min) / (config.max - config.min)) * 100;
      const end = ((max - config.min) / (config.max - config.min)) * 100;
      slider.style.setProperty("--range-start", `${start}%`);
      slider.style.setProperty("--range-end", `${end}%`);
      minRange.value = String(min);
      maxRange.value = String(max);
      minInput.value = min ? String(min) : "";
      maxInput.value = max === config.max ? "" : String(max);
      minLabel.textContent = `${min.toLocaleString("ru-RU")} м²`;
      maxLabel.textContent = `${max.toLocaleString("ru-RU")} м²`;
      minLabel.style.left = `${start}%`;
      maxLabel.style.left = `${end}%`;
    };

    const sync = (source) => {
      const values = clamp(source === "min" ? minRange.value : minInput.value, source === "max" ? maxRange.value : maxInput.value, source);
      filters.areaMin = values.min ? String(values.min) : "";
      filters.areaMax = values.max === config.max ? "" : String(values.max);
      paint(values.min, values.max);
      renderCatalogLots();
    };

    paint(Number(filters.areaMin || 0), Number(filters.areaMax || config.max));
    minRange.addEventListener("input", () => sync("min"));
    maxRange.addEventListener("input", () => sync("max"));
    minInput.addEventListener("input", () => {
      minInput.value = minInput.value.replace(/[^\d]/g, "");
      sync("min");
    });
    maxInput.addEventListener("input", () => {
      maxInput.value = maxInput.value.replace(/[^\d]/g, "");
      sync("max");
    });
  }

  function onFilterChange(event) {
    const input = event.currentTarget;
    if (input.type === "checkbox") filters[input.dataset.filter] = input.checked;
    else filters[input.dataset.filter] = input.value;

    if (filters.deal === "buy" && filters.object === "mitino") filters.object = "all";
    if (["areaMin", "areaMax"].includes(input.dataset.filter)) {
      const min = Number(filters.areaMin || 0);
      const max = Number(filters.areaMax || 6000);
      if (min > max) {
        if (input.dataset.filter === "areaMin") filters.areaMax = String(min);
        else filters.areaMin = String(max);
        renderFilters();
        bindFilterInputs();
      }
    }
    renderCatalogLots();
  }

  function resetFilters() {
    filters = { q: "", deal: "rent", object: "all", type: "all", areaMin: "", areaMax: "", priceMin: "", priceMax: "", floor: "all", wholeOnly: false, favorites: false, sort: "recommended" };
    renderFilters();
    bindFilterInputs();
    document.querySelector('[data-filter="sort"]').value = "recommended";
    renderCatalogLots();
  }

  function renderCatalogLots() {
    const lots = filteredLots();
    const grid = document.querySelector("[data-catalog-lots]");
    if (grid) {
      grid.innerHTML = lots.map(lotCard).join("");
      applyFormatLabels(grid);
    }
    if (revealObserver) refreshRevealTargets();
    document.querySelector("[data-results-count]").textContent = `Найдено: ${lots.length} из ${data.lots.length}`;
    document.querySelector("[data-buy-note]").hidden = filters.deal !== "buy";
    renderFavoriteSummary();
    renderActiveFilters();
    renderEmptyState(lots);
    writeQuery();
  }

  function filteredLots() {
    const favs = getFavorites();
    const query = normalize(filters.q);
    let lots = data.lots.filter((lot) => {
      const object = objectById[lot.building];
      const haystack = normalize([object.title, object.shortTitle, lot.id, lot.type, lot.subType, lot.purpose, lot.category, lot.condition].join(" "));
      const price = lot.sortPrice || lot.sortRate || 0;
      const objectMatch = filters.object === "all" || filters.object.split(",").includes(lot.building);
      return (!query || haystack.includes(query))
        && (filters.deal === "all" || lot.deal === filters.deal)
        && objectMatch
        && (filters.type === "all" || lot.category === filters.type)
        && (!filters.areaMin || lot.area >= Number(filters.areaMin))
        && (!filters.areaMax || lot.area <= Number(filters.areaMax))
        && (!filters.priceMin || price >= Number(filters.priceMin))
        && (!filters.priceMax || price <= Number(filters.priceMax))
        && (filters.floor === "all" || lot.floor === filters.floor)
        && (!filters.wholeOnly || lot.type.toLowerCase().includes("целиком"))
        && (!filters.favorites || favs.includes(lot.id));
    });
    lots = enforceBuyRules(lots);
    return sortLots(lots);
  }

  function enforceBuyRules(lots) {
    if (filters.deal !== "buy") return lots;
    return lots.filter((lot) => ["NKR-SALE-01", "GRK-SALE-01"].includes(lot.id));
  }

  function sortLots(lots) {
    const sorted = [...lots];
    const sort = filters.sort || document.querySelector('[data-filter="sort"]')?.value || "recommended";
    if (sort === "areaAsc") sorted.sort((a, b) => a.area - b.area);
    if (sort === "areaDesc") sorted.sort((a, b) => b.area - a.area);
    if (sort === "priceAsc") sorted.sort((a, b) => (a.sortPrice || a.sortRate || 0) - (b.sortPrice || b.sortRate || 0));
    if (sort === "priceDesc") sorted.sort((a, b) => (b.sortPrice || b.sortRate || 0) - (a.sortPrice || a.sortRate || 0));
    if (sort === "floor") sorted.sort((a, b) => String(a.floor).localeCompare(String(b.floor), "ru"));
    if (sort === "object") sorted.sort((a, b) => objectById[a.building].shortTitle.localeCompare(objectById[b.building].shortTitle, "ru"));
    return sorted;
  }

  function renderActiveFilters() {
    const target = document.querySelector("[data-active-filters]");
    if (!target) return;
    const labels = [];
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || value === "all" || value === "recommended" || value === false) return;
      labels.push([key, ["favorites", "wholeOnly"].includes(key) ? filterName(key) : `${filterName(key)}: ${filterLabel(key, value)}`]);
    });
    target.innerHTML = labels.map(([key, label]) => `<span class="active-chip">${label}<button type="button" data-remove-filter="${key}">×</button></span>`).join("");
    target.querySelectorAll("[data-remove-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.removeFilter;
        if (["favorites", "wholeOnly"].includes(key)) filters[key] = false;
        else filters[key] = key === "sort" ? "recommended" : "";
        if (["object", "type", "floor"].includes(key)) filters[key] = "all";
        if (key === "deal") filters[key] = "rent";
        renderFilters();
        bindFilterInputs();
        renderCatalogLots();
      });
    });
  }


  function renderFavoriteSummary() {
    const target = document.querySelector("[data-favorite-summary]");
    if (!target) return;
    const favIds = getFavorites();
    const validFavs = favIds.filter((id) => data.lots.some((lot) => lot.id === id));
    target.hidden = validFavs.length === 0;
    if (!validFavs.length) return;
    const favLots = validFavs.map((id) => data.lots.find((lot) => lot.id === id)).filter(Boolean);
    target.innerHTML = `
      <div>
        <strong>В избранном: ${validFavs.length}</strong>
        <p>Сохранённые помещения можно быстро сравнить и отправить менеджеру одной подборкой.</p>
      </div>
      <div class="favorite-summary-actions">
        <button class="btn btn-dark" type="button" data-show-favorites>Показать избранное</button>
        <button class="btn btn-primary" type="button" data-open-request data-context="Избранные помещения: ${validFavs.join(", ")}">Запросить подборку</button>
      </div>
      <details class="favorite-compare">
        <summary>Сравнить избранные</summary>
        <div class="favorite-compare-table">
          ${favLots.map((lot) => `<div><strong>${lot.id}</strong><span>${objectById[lot.building].shortTitle}</span><span>${formatArea(lot.area)}</span><span>${lot.rate}</span></div>`).join("")}
        </div>
      </details>
    `;
    target.querySelector("[data-show-favorites]")?.addEventListener("click", () => {
      filters.favorites = true;
      renderFilters();
      bindFilterInputs();
      renderCatalogLots();
    });
  }

  function renderEmptyState(lots) {
    const target = document.querySelector("[data-empty-state]");
    if (!target) return;
    target.hidden = lots.length > 0;
    if (lots.length > 0) return;
    if (filters.favorites) target.textContent = "В избранном пока нет помещений.";
    else if (filters.deal === "buy" && filters.object === "mitino") target.textContent = "Промтехнопарк «Митино» сейчас доступен только в аренду. Для покупки выберите Промтехнопарк «Некрасовка» или Медицинский центр «Грекова».";
    else target.textContent = "По выбранным параметрам помещения не найдены. Сбросьте фильтр или измените запрос.";
  }

  function writeQuery() {
    if (page !== "catalog") return;
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (!value || value === "all" || value === "recommended" || value === false) return;
      params.set(key, value === true ? "1" : value);
    });
    const url = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState(null, "", url);
  }

  function getLotMedia(lot, object) {
    if (lot?.id === "NKR-ALL-R" || lot?.id === "NKR-SALE-01") {
      return { src: object.image, isPlan: false, alt: `${object.title} · ${lot.id}` };
    }

    const plan = lot?.plan || "";
    const isPlan =
      (lot?.building === "grekova" && plan.startsWith("grekova-plan-")) ||
      (lot?.building === "mitino" && plan.startsWith("layout-b37a-")) ||
      (lot?.building === "nekrasovka" && plan.startsWith("layout-nekrasovka-"));
    if (isPlan) {
      return { src: `assets/${plan}`, isPlan: true, alt: `Планировка ${lot.type} · ${lot.id}` };
    }
    return { src: object.image, isPlan: false, alt: `${object.title} · ${lot.id}` };
  }

  function formatLabel(slug = "") {
    const labels = {
      office: "Офис",
      industrial: "Light industrial",
      mezzanine: "Мезонин",
      showroom: "Шоурум",
      food: "Общепит",
      retail: "Street retail",
      service: "Сервис",
      medical: "Медицинский центр"
    };
    const key = String(slug).trim().toLowerCase();
    if (labels[key]) return labels[key];
    return key ? key.charAt(0).toUpperCase() + key.slice(1) : "Формат";
  }

  function applyFormatLabels(root = document) {
    root.querySelectorAll("[data-format]").forEach((node) => {
      node.textContent = formatLabel(node.dataset.format || node.textContent);
    });
  }

  function getHeightLabel(lot) {
    const raw = String(lot?.ceiling || "");
    return raw.toLowerCase().includes("высота здания") ? "Высота здания" : "Потолки";
  }

  function getHeightValue(lot) {
    return String(lot?.ceiling || "").replace(/\s*высота здания\s*/i, "").trim();
  }

  function renderFavoriteIcon(active) {
    return active ? "♥" : "♡";
  }

  function lotCard(lot) {
    if (!lot) return "";
    const object = objectById[lot.building];
    const dealLabel = lot.deal === "rent" ? "Аренда" : "Покупка";
    const isFav = getFavorites().includes(lot.id);
    const whole = lot.type.toLowerCase().includes("целиком");
    const title = `${object.shortTitle} · ${lot.type}${!whole && lot.floor ? ` · ${lot.floor} этаж` : ""}`;
    const priceLabel = lot.deal === "buy" ? "Цена" : "Ставка";
    const scenario = lot.highlights?.slice(0, 2).join(" · ") || lot.purpose.split("/")[0].trim();
    const media = getLotMedia(lot, object);
    return `
      <article class="lot-card reveal" data-lot-id="${lot.id}">
        <div class="lot-media ${media.isPlan ? "lot-media--plan" : ""}"><img src="${media.src}" alt="${media.alt}" loading="lazy"></div>
        <div class="lot-body">
          <div class="lot-top">
            <div><p class="lot-id">${lot.id}</p><h3>${title}</h3></div>
            <button class="favorite-btn ${isFav ? "is-active" : ""}" type="button" data-favorite="${lot.id}" aria-label="Добавить в избранное">${renderFavoriteIcon(isFav)}</button>
          </div>
          <div class="lot-badges">
            <span>${dealLabel}</span>
            ${whole ? "<span>Здание целиком</span>" : `<span data-format="${lot.category}">${formatLabel(lot.category)}</span>`}
            <span>${lot.condition.split("·")[0].trim()}</span>
          </div>
          <div class="lot-specs lot-specs--labeled">
            <span><small>Площадь</small><strong>${formatArea(lot.area)}</strong></span>
            <span><small>Этаж</small><strong>${lot.floor}</strong></span>
            <span><small>${getHeightLabel(lot)}</small><strong>${getHeightValue(lot)}</strong></span>
            <span><small>${priceLabel}</small><strong>${lot.rate}</strong></span>
          </div>
          <p class="lot-scenario">${scenario}</p>
        </div>
        <div class="lot-actions">
          <button class="btn btn-dark" type="button" data-open-lot="${lot.id}">Подробнее</button>
          <button class="btn btn-primary" type="button" data-open-request data-building="${lot.building}" data-lot="${lot.id}" data-context="Запрос условий по ${lot.id}">Оставить заявку</button>
        </div>
      </article>
    `;
  }

  function renderObjectPage() {
    const id = document.body.dataset.object;
    const object = objectById[id];
    const lots = data.lots.filter((lot) => lot.building === id);
    const target = document.querySelector("[data-object-page]");
    if (!object || !target) return;
    const isMitino = id === "mitino";

    if (id === "mitino") {
      const mitinoKpis = [
        ["11 776,20 м²", "общая площадь комплекса", "assets/icon-kpi-area.svg"],
        ["1,5 МВт", "электрическая мощность", "assets/icon-kpi-power.svg"],
        ["70 м/м", "парковочных мест", "assets/icon-kpi-parking.svg"],
        ["III кв. 2026", "ввод в эксплуатацию", "assets/icon-kpi-calendar.svg"]
      ];

      const mitinoSpecs = [
        ["Производственная часть", "6 662,08 м²", "light industrial, сборка, сервис, R&D"],
        ["Офисная часть", "3 400,93 м²", "back office, штаб-квартира, проектные команды"],
        ["Потолки", "до 8 м", "производственный контур, офисы и мезонины"],
        ["Нагрузка на пол", "до 5 т/м²", "для производственных и складских сценариев"],
        ["Шаг колонн", "6×9 м / 12×9 м", "гибкость планировочных решений"],
        ["Погрузка", "6 ворот", "из них 3 с доклевеллером"]
      ];

      const mitinoInfrastructure = [
        ["assets/icon-mitino-lease.svg", "Долгосрочная аренда", "Согласование улучшений, понятная экономика и возможность настроить помещение под процесс арендатора."],
        ["assets/icon-mitino-planning.svg", "Функциональная планировка", "Производство, мезонины, офисы, showroom и общепит можно собирать в рабочие сценарии без лишних дублей."],
        ["assets/icon-mitino-team.svg", "Инфраструктура для команды", "Коворкинг, showroom, кафе, фитнес-зона, падел-корт, зеленая веранда и зарядные станции."],
        ["assets/icon-mitino-combine.svg", "Объединение функций", "Объект подходит компаниям, которым нужно разместить производство, инженерный офис и клиентскую зону в одном адресе."]
      ];

      const mitinoLocationFacts = [
        ["15 минут", "до метро Пятницкое шоссе и Митино"],
        ["4 км", "до МКАД"],
        ["5 минут", "до Пятницкого шоссе"],
        ["Барышиха 37А", "адрес объекта"]
      ];

      const mitinoRoadmap = [
        ["Выполнено", "Основной контур", "Ключевые строительные работы и фасадная часть доведены до финальной стадии."],
        ["Текущий этап", "Инженерия и внутренние работы", "Финализация внутренних и инженерных работ перед пусконаладкой."],
        ["Подготовка", "Пусконаладка", "Проверки, настройка инженерных систем и подготовка к передаче площадей."],
        ["III кв. 2026", "Ввод в эксплуатацию", "Плановый ввод объекта и старт операционного сценария для резидентов."]
      ];

      const mitinoTerms = [
        ["Light industrial", "18 000 руб./м²/год", "производство, склад, мезонины"],
        ["Офис", "28 000 руб./м²/год", "3–4 этажи, back office, штаб-квартира"],
        ["Showroom / общепит", "29 000 руб./м²/год", "1 этаж, клиентский доступ"],
        ["Состояние", "Shell & Core", "адаптация под требования арендатора"]
      ];

      const mitinoPhysicalLots = lots.filter((lot) => lot.deal === "rent");
      const mitinoCombined = {
        title: "Производственно-офисный контур",
        subtitle: "сценарий объединения из существующих помещений · не отдельное новое помещение",
        area: "5 106,23 м²",
        meta: ["3 614,22 м² производственно-складские площади", "1 325,73 м² офисы", "166,28 м² зона погрузки", "1, 3 и 4 этажи"],
        rates: "18 000 руб./м² производство · 28 000 руб./м² офис"
      };

      const categoryLabel = (category) => ({
        industrial: "Производство",
        mezzanine: "Мезонин",
        office: "Офис",
        showroom: "Showroom",
        food: "Общепит"
      }[category] || "Аренда");

      const yandexMapUrl = "https://yandex.ru/map-widget/v1/?ll=37.340891%2C55.849145&z=16&l=map&pt=37.340891,55.849145,pm2rdm";

      const carouselItems = (() => {
        const ns = Array.from({length: 10}, (_, i) => String(i + 1).padStart(2, "0"));
        // 1 start clone + 10 real + 3 end clones (for seamless loop with 3 visible items)
        const all = [ns[9], ...ns, ns[0], ns[1], ns[2]];
        return all.map((n, idx) => {
          const isClone = idx === 0 || idx > 10;
          const ri = idx === 0 ? 9 : (idx <= 10 ? idx - 1 : idx - 11);
          return `<div class="mc-item" data-ci="${ri}"${isClone ? ' aria-hidden="true"' : ""}><img src="assets/Carusel/${n}.jpg" alt="Митино — фото ${ri + 1}" draggable="false" loading="lazy"></div>`;
        }).join("");
      })();

      target.innerHTML = `
        <section class="object-hero section-dark mitino-hero">
          <div class="object-hero-media"><img src="${object.image}" alt="${object.title}" fetchpriority="high"></div>
          <div class="object-hero-content">
            <p class="eyebrow">Бутик-промтехнопарк класса A+ · СЗАО Москвы</p>
            <h1>Митино для производства, офиса и клиентских форматов</h1>
            <p>Промтехнопарк на Барышиха 37А объединяет light industrial, офисы, showroom, общепит, мезонинные блоки и сценарий единого производственно-офисного контура. Объект доступен только в аренду, поэтому на странице нет ложных сценариев покупки.</p>
            <div class="hero-labels"><span>11 776,20 м²</span><span>1,5 МВт</span><span>70 м/м</span><span>III кв. 2026</span></div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#mitino-lots">Свободные площади</a>
              <a class="btn btn-ghost" href="#mitino-combination">Сценарий объединения</a>
              <a class="btn btn-ghost" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
              <button class="btn btn-ghost" type="button" data-open-request data-building="${object.id}" data-context="Митино · подбор помещения">Оставить заявку</button>
            </div>
          </div>
        </section>

        <section class="object-content nkr-page mitino-page">
          <nav class="nkr-subnav reveal" aria-label="Разделы страницы Митино">
            <a href="#mitino-about">О проекте</a>
            <a href="#mitino-specs">Характеристики</a>
            <a href="#mitino-infrastructure">Инфраструктура</a>
            <a href="#mitino-location">Локация</a>
            <a href="#mitino-roadmap">Ход работ</a>
            <a href="#mitino-terms">Условия</a>
            <a href="#mitino-lots">Помещения</a>
          </nav>

          <section class="nkr-section mitino-gallery-section">
            <div class="section-head">
              <p class="eyebrow">Галерея</p>
              <h2>Лобби</h2>
              <p>Текущее состояние промтехнопарка на Барышиха 37А. Ввод в эксплуатацию запланирован на III квартал 2026 года.</p>
            </div>
            <div class="mc-root" id="mc-root">
              <div class="mc-track" id="mc-track">
                ${carouselItems}
              </div>
              <button class="mc-arrow mc-arrow--prev" id="mc-prev" aria-label="Предыдущий слайд">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8L10 13"/></svg>
              </button>
              <button class="mc-arrow mc-arrow--next" id="mc-next" aria-label="Следующий слайд">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3L11 8L6 13"/></svg>
              </button>
              <div class="mc-hud">
                <span class="mc-count" id="mc-count">01 / 10</span>
                <div class="mc-dots" id="mc-dots">
                  ${Array.from({length: 10}, (_, i) => `<button class="mc-dot${i === 0 ? " is-active" : ""}" aria-label="Слайд ${i + 1}"></button>`).join("")}
                </div>
              </div>
              <div class="mc-progress" id="mc-progress"></div>
            </div>
          </section>

          <section class="nkr-section mitino-overview" id="mitino-about">
            <div class="section-head">
              <p class="eyebrow">О проекте</p>
              <h2>Площади для производства, офиса, showroom и коммерческих форматов</h2>
              <p>Объект расположен в Митино по адресу Москва, Барышиха 37А. Это современный промтехнопарк для компаний, которым важно разместить операционный контур, офисную команду, клиентский формат и сервисные функции в одной городской локации.</p>
            </div>
            <div class="nkr-kpi-grid">
              ${mitinoKpis.map(([value, label, icon]) => `
                <article class="nkr-glass-card mitino-kpi-card reveal">
                  <span class="mitino-kpi-icon" aria-hidden="true"><img src="${icon}" alt=""></span>
                  <span class="mitino-kpi-copy"><strong>${value}</strong><span>${label}</span></span>
                </article>
              `).join("")}
            </div>
          </section>

          <section class="nkr-section" id="mitino-specs">
            <div class="section-head">
              <p class="eyebrow">Технические характеристики</p>
              <h2>Параметры, которые важны для производственного и офисного сценария</h2>
              <p>Структура комплекса рассчитана на гибкое разделение функций: производственная часть, офисные этажи, мезонины, зоны клиентского доступа и погрузочно-разгрузочный контур.</p>
            </div>
            <div class="nkr-levels mitino-spec-grid">
              ${mitinoSpecs.map(([label, value, note]) => `
                <article class="nkr-level-card reveal">
                  <span>${label}</span>
                  <strong>${value}</strong>
                  <p>${note}</p>
                </article>
              `).join("")}
            </div>
          </section>

          <section class="nkr-section" id="mitino-infrastructure">
            <div class="section-head">
              <p class="eyebrow">Инфраструктура и среда</p>
              <h2>Объект как рабочая среда</h2>
              <p>Инфраструктура поддерживает ежедневную работу команды, клиентские встречи и операционные сценарии арендаторов.</p>
            </div>
            <div class="nkr-plan-grid mitino-infrastructure-grid">
              ${mitinoInfrastructure.map(([icon, title, text]) => `
                <article class="mitino-feature-card reveal">
                  <div class="mitino-feature-icon"><img src="${icon}" alt="" loading="lazy"></div>
                  <h3>${title}</h3>
                  <p>${text}</p>
                </article>
              `).join("")}
            </div>
            <div class="rule-block nkr-rule-block reveal">
              <h3>Доступная инфраструктура</h3>
              <p>Коворкинг, showroom, кафе, фитнес-зона, корт для падела, зеленая веранда на крыше и зарядные станции для электромобилей дополняют производственно-офисную функцию объекта.</p>
            </div>
          </section>

          <section class="nkr-section" id="mitino-location">
            <div class="section-head">
              <p class="eyebrow">Локация</p>
              <h2>Митино: удобный адрес для сотрудников, клиентов и поставщиков</h2>
              <p>Локация между Пятницким и Волоколамским шоссе подходит для ежедневной работы команды, доставки, сервисных выездов и клиентских визитов.</p>
            </div>
            <div class="nkr-location-grid">
              <div class="nkr-map-card reveal">
                <iframe title="Яндекс.Карта объекта Митино, Барышиха 37А" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${yandexMapUrl}"></iframe>
              </div>
              <aside class="nkr-location-card reveal">
                <p class="eyebrow">Точные координаты</p>
                <h3>55.849145, 37.340891</h3>
                <p>Москва, Барышиха 37А. Карта подтянута через Яндекс.Карты, отметка закреплена строго по координатам объекта.</p>
                <div class="nkr-coords">55°50'56.9"N · 37°20'27.2"E</div>
                <div class="section-actions"><a class="btn btn-dark" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a><a class="btn btn-ghost" href="${getYandexObjectUrl(object.id)}" target="_blank" rel="noopener noreferrer">Открыть в Яндекс.Картах</a></div>
              </aside>
            </div>
            <div class="nkr-kpi-grid mitino-location-facts">
              ${mitinoLocationFacts.map(([value, label]) => `<article class="nkr-glass-card reveal"><strong>${value}</strong><span>${label}</span></article>`).join("")}
            </div>
          </section>

          <section class="nkr-section" id="mitino-roadmap">
            <div class="section-head">
              <p class="eyebrow">Ход строительства</p>
              <h2>Финальная стадия перед вводом</h2>
              <p>Страница фиксирует текущую логику проекта: объект находится в финальной стадии, плановый ввод — III квартал 2026 года.</p>
            </div>
            <div class="nkr-roadmap mitino-roadmap">
              ${mitinoRoadmap.map(([date, title, text], index) => `
                <article class="nkr-roadmap-item reveal">
                  <span>0${index + 1}</span>
                  <strong>${date}</strong>
                  <h3>${title}</h3>
                  <p>${text}</p>
                </article>
              `).join("")}
            </div>
          </section>

          <section class="nkr-section" id="mitino-terms">
            <div class="section-head">
              <p class="eyebrow">Коммерческие условия</p>
              <h2>Аренда</h2>
            </div>
            <div class="nkr-commercial-grid">
              <article class="nkr-commercial-card reveal">
                <h3>Базовые ставки</h3>
                <div class="nkr-mini-table mitino-terms-table">
                  <div><span>Формат</span><span>Ставка</span><span>Сценарий</span></div>
                  ${mitinoTerms.map(([format, rate, note]) => `<div><span>${format}</span><span>${rate}</span><span>${note}</span></div>`).join("")}
                </div>
              </article>
              <article class="nkr-commercial-card reveal">
                <h3>Структура помещений</h3>
                <p>Помещения не дублируются. Производственно-офисный контур — это вариант объединения уже существующих площадей: производственной части, мезонинов, офисов и зоны погрузки.</p>
                <div class="nkr-sale-summary mitino-term-summary">
                  <div><span>Сделка</span><strong>аренда</strong></div>
                  <div><span>Помещений</span><strong>7</strong></div>
                  <div><span>Объединение</span><strong>5 106,23 м²</strong></div>
                </div>
              </article>
            </div>
          </section>

          <section class="nkr-section" id="mitino-lots">
            <div class="section-head">
              <p class="eyebrow">Доступно к аренде</p>
              <h2>7 помещений и один сценарий объединения</h2>
            </div>
            <div class="nkr-offer-grid mitino-offer-grid">
              ${mitinoPhysicalLots.map((lot) => `
                <article class="nkr-offer-card mitino-offer-card reveal">
                  <div>
                    <p class="eyebrow">${categoryLabel(lot.category)} · ${lot.id}</p>
                    <h3>${lot.type}</h3>
                    <p>${lot.subType}</p>
                    <strong>${formatArea(lot.area)}</strong>
                    <ul>
                      <li>${lot.rate}</li>
                      <li>${lot.floor} этаж · потолки ${lot.ceiling}</li>
                      <li>${lot.purpose}</li>
                      <li>${lot.condition}</li>
                    </ul>
                  </div>
                  <div class="nkr-offer-actions">
                    <button class="btn btn-dark" type="button" data-open-lot="${lot.id}">Подробнее</button>
                    <button class="btn btn-ghost" type="button" data-open-request data-building="${lot.building}" data-lot="${lot.id}" data-context="Митино · ${lot.id}">Запросить</button>
                  </div>
                </article>
              `).join("")}
              <article class="nkr-offer-card mitino-offer-card mitino-offer-card--combo reveal" id="mitino-combination">
                <div>
                  <p class="eyebrow">Сценарий объединения · без дубля</p>
                  <h3>${mitinoCombined.title}</h3>
                  <p>${mitinoCombined.subtitle}</p>
                  <strong>${mitinoCombined.area}</strong>
                  <ul>${mitinoCombined.meta.map((item) => `<li>${item}</li>`).join("")}<li>${mitinoCombined.rates}</li></ul>
                </div>
                <div class="nkr-offer-actions">
                  <button class="btn btn-dark" type="button" data-open-request data-building="${object.id}" data-context="Митино · производственно-офисный контур 5 106,23 м²">Запросить контур</button>
                  <a class="btn btn-ghost" href="lots.html?deal=rent&object=mitino">Смотреть каталог</a>
                </div>
              </article>
            </div>
          </section>
        </section>
      `;
      initMitinoCarousel();
      return;
    }

    if (id === "nekrasovka") {
      const nkrLevels = [
        {
          level: "-1 этаж",
          area: "229,18 м²",
          note: "подземно-технический уровень · 229,18 м²",
          icon: "assets/icon-nkr-technical.svg",
          role: "технический",
          summary: "Подземный уровень с инженерной и обслуживающей функцией.",
          chips: ["технические помещения"],
          details: [["Функция", "технические помещения"]]
        },
        {
          level: "1 этаж",
          area: "2 509,78 м²",
          note: "2 509,78 м²",
          icon: "assets/icon-nkr-floor.svg",
          role: "производственный",
          summary: "Основной производственный уровень с максимальной нагрузкой на перекрытие.",
          chips: ["h 8,0 м", "5,0 т/м²"],
          details: [["Высота потолка", "8,0 м"], ["Нагрузка на перекрытие", "5,0 т/м²"]]
        },
        {
          level: "2 этаж",
          area: "2 571,35 м²",
          note: "2 571,35 м²",
          icon: "assets/icon-nkr-layers.svg",
          role: "light industrial",
          summary: "Второй уровень под производство, сборку и сопутствующие сценарии АБК.",
          chips: ["h 6,2 м", "2,5 т/м²"],
          details: [["Высота потолка", "6,2 м"], ["Нагрузка на перекрытие", "2,5 т/м²"]]
        },
        {
          level: "Антресоль",
          area: "196,65 м²",
          note: "196,65 м²",
          icon: "assets/icon-nkr-mezzanine.svg",
          role: "вспомогательный",
          summary: "Дополнительный уровень под сервисные, офисные и вспомогательные функции.",
          chips: ["h 4,0 м"],
          details: [["Высота потолка", "4,0 м"]]
        }
      ];

      const nkrBreakdown = [
        ["Производственные", "3 921,43 м²", "75.6%"],
        ["АБК", "785,19 м²", "15.1%"],
        ["Вертикальные", "240,35 м²", "4.6%"],
        ["Технические", "226,57 м²", "4.4%"],
        ["Общие зоны", "15,18 м²", "0.3%"]
      ];

      const nkrRoadmap = [
        ["май 2026", "текущий этап", "базовые коммерческие условия"],
        ["июнь 2026", "получение РНС", "переход к ДКПБВ / фиксация условий"],
        ["I кв. 2027", "активная стройка", "рост готовности и стоимости"],
        ["III кв. 2027", "готовность контура", "финализация строительного цикла"],
        ["IV кв. 2027", "ввод в эксплуатацию", "передача объекта и документов"]
      ];

      const rentDynamics = [
        ["май 2026", "15 500", "база"],
        ["июнь 2026", "16 430", "+6%"],
        ["I кв. 2027", "17 360", "+12%"],
        ["III кв. 2027", "18 290", "+18%"],
        ["IV кв. 2027", "19 375", "+25%"]
      ];

      const saleDynamics = [
        ["май 2026", "200 000", "база"],
        ["июнь 2026", "216 000", "+8%"],
        ["I кв. 2027", "236 000", "+18%"],
        ["III кв. 2027", "256 000", "+28%"],
        ["IV кв. 2027", "280 000", "+40%"]
      ];

      const floorRent = [
        ["1 этаж", "2 509,78 м²", "8,0 м", "5,0 т/м²", "18 000 ₽/м²/год"],
        ["Антресоль", "196,65 м²", "4,0 м", "—", "16 000 ₽/м²/год"],
        ["2 этаж", "2 571,35 м²", "6,2 м", "2,5 т/м²", "15 000 ₽/м²/год"]
      ];

      const paymentPlan = [
        ["ПДКП", "май 2026", "5%", "55 070 000", "55 070 000", "1 046 330 000"],
        ["Получение РНС", "июнь 2026", "—", "—", "55 070 000", "1 046 330 000"],
        ["Заключение ДКПБВ", "июнь 2026", "30%", "330 420 000", "385 490 000", "715 910 000"],
        ["Равный платеж 1", "I кв. 2027", "16,25%", "178 977 500", "564 467 500", "536 932 500"],
        ["Равный платеж 2", "III кв. 2027", "16,25%", "178 977 500", "743 445 000", "357 955 000"],
        ["Равный платеж 3", "IV кв. 2027", "16,25%", "178 977 500", "922 422 500", "178 977 500"],
        ["Равный платеж 4 / закрытие", "I кв. 2028", "16,25%", "178 977 500", "1 101 400 000", "0"]
      ];
      const saleTotalRub = 1101400000;
      const toPaymentNumber = (value) => Number(String(value).replace(/[^\d]/g, "")) || 0;
      const toPaymentProgress = (value) => `${Math.min(100, (toPaymentNumber(value) / saleTotalRub) * 100).toFixed(2)}%`;
      const toDynamicsLevel = (rows, value) => {
        const values = rows.map((row) => toPaymentNumber(row[1]));
        const max = Math.max(...values, 1);
        return `${((toPaymentNumber(value) / max) * 100).toFixed(2)}%`;
      };
      const rentTerms = [
        ["OPEX", "3 000 ₽/м²/год"],
        ["НДС", "22% сверху"],
        ["Коммунальные", "по факту"],
        ["Модель", "open book"],
        ["Индексация", "7% / CPI"],
        ["Fit-out", "2–6 мес."],
        ["Pre-lease", "скидка 5–7%"],
        ["Срок по блокам", "3–5 лет"]
      ];

      const uniqueOffers = [
        {
          title: "Здание целиком",
          subtitle: "1–2 этажи + антресоль · аренда или покупка целиком",
          area: "5 507 м²",
          meta: ["800 кВт", "6×9 м и 12×9 м", "Q4 2027"],
          rentLot: "NKR-ALL-R",
          buyLot: "NKR-SALE-01",
          rent: "15 500 ₽/м²/год",
          buy: "200 000 ₽/м²"
        },
        {
          title: "1 этаж · Light industrial",
          subtitle: "производственный уровень с погрузкой и сервисом",
          area: "2 509,78 м²",
          meta: ["8,0 м", "5,0 т/м²", "18 000 ₽/м²/год"],
          rentLot: "NKR-01"
        },
        {
          title: "Антресоль",
          subtitle: "вспомогательная функция, сервис или хранение",
          area: "196,65 м²",
          meta: ["4,0 м", "компактный блок", "16 000 ₽/м²/год"],
          rentLot: "NKR-MZ"
        },
        {
          title: "2 этаж · Light industrial / АБК",
          subtitle: "производственная и административная функция в составе этажа",
          area: "2 571,35 м²",
          meta: ["6,2 м", "2,5 т/м²", "15 000 ₽/м²/год"],
          rentLot: "NKR-02"
        }
      ];

      const yandexMapUrl = "https://yandex.ru/map-widget/v1/?ll=37.930757%2C55.676544&z=15&l=map&pt=37.930757,55.676544,pm2rdm";
      const getOfferMediaMarkup = (offer) => {
        const offerLot = data.lots.find((lot) => lot.id === (offer.rentLot || offer.buyLot));
        if (!offerLot) return "";
        const media = getLotMedia(offerLot, object);
        return `<div class="nkr-offer-media ${media.isPlan ? "nkr-offer-media--plan" : ""}"><img src="${media.src}" alt="${media.alt}" loading="lazy"></div>`;
      };

      target.innerHTML = `
        <section class="object-hero section-dark nkr-hero">
          <div class="object-hero-media"><img src="${object.image}" alt="${object.title}" fetchpriority="high"></div>
          <div class="object-hero-content">
            <p class="eyebrow">Промышленный парк · ЮВАО Москвы</p>
            <h1>${object.title}</h1>
            <p>Современный light industrial объект в городской локации: производственные, административные и сервисные площади в одном здании с коротким плечом до МКАД и ключевых магистралей.</p>
            <div class="hero-labels"><span>5 507 м²</span><span>800 кВт</span><span>Ввод IV кв. 2027</span><span>РНС июнь 2026</span></div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#nkr-lots">Смотреть предложения</a>
              <a class="btn btn-ghost" href="lots.html?deal=buy&object=nekrasovka">Покупка здания целиком</a>
              <a class="btn btn-ghost" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
              <button class="btn btn-ghost" type="button" data-open-request data-building="${object.id}" data-context="Некрасовка · подбор помещения">Оставить заявку</button>
            </div>
          </div>
        </section>

        <section class="object-content nkr-page nekrasovka-page">
          <nav class="nkr-subnav reveal" aria-label="Разделы страницы Некрасовки">
            <a href="#nkr-about">О проекте</a>
            <a href="#nkr-specs">Характеристики</a>
            <a href="#nkr-composition">Состав</a>
            <a href="#nkr-location">Локация</a>
            <a href="#nkr-roadmap">Дорожная карта</a>
            <a href="#nkr-terms">Условия</a>
            <a href="#nkr-lots">Помещения</a>
          </nav>

          <section class="nkr-section nkr-overview" id="nkr-about">
            <div class="section-head">
              <p class="eyebrow">О проекте</p>
              <h2>Производственные, административные и сервисные площади в одном здании</h2>
              <p>Промышленный парк в Некрасовке рассчитан на размещение производства, административной и сервисной функции в одном объекте. Проект сочетает удобство для операционной деятельности, современную архитектуру и расположение в сформированном промышленном кластере юго-востока Москвы.</p>
            </div>
            <div class="nkr-kpi-grid">
              ${[
                ["2 уровня", "надземная часть"],
                ["1 уровень", "подземно-технический"],
                ["20 м/м", "парковка, включая 3 места с зарядкой"],
                ["6 688 м²", "площадь земельного участка"]
              ].map(([value, label]) => `<article class="nkr-glass-card reveal"><strong>${value}</strong><span>${label}</span></article>`).join("")}
            </div>
          </section>

          <section class="nkr-section nkr-tech-showcase" id="nkr-specs">
            <div class="nkr-tech-head reveal">
              <p class="eyebrow">Технические характеристики</p>
              <h2>Параметры объекта по уровням и ключевые показатели здания</h2>
            </div>
            <div class="nkr-tech-layout">
              <div class="nkr-tech-visual reveal">
                <img src="assets/nekrasovka-levels-exploded.webp" alt="Некрасовка — схема объекта по уровням" loading="lazy">
              </div>
              <div class="nkr-tech-panel reveal">
                <div class="nkr-tech-panel-top">
                  <span>по уровням</span>
                </div>
                <div class="nkr-tech-cards">
                  ${nkrLevels.map((item) => `
                    <article class="nkr-tech-card reveal">
                      <div class="nkr-tech-card-main">
                        <div class="nkr-tech-icon"><img src="${item.icon}" alt="" aria-hidden="true"></div>
                        <div class="nkr-tech-copy">
                          <h3>${item.level}</h3>
                          <p>${item.note}</p>
                        </div>
                      </div>
                      <div class="nkr-tech-metrics ${item.details.length === 1 ? "nkr-tech-metrics--single" : ""}">
                        ${item.details.map(([label, value]) => `
                          <div class="nkr-tech-metric">
                            <span>${label}</span>
                            <strong>${value}</strong>
                          </div>
                        `).join("")}
                      </div>
                    </article>
                  `).join("")}
                </div>
              </div>
            </div>
          </section>

          <section class="nkr-section" id="nkr-composition">
            <div class="section-head">
              <p class="eyebrow">Функциональный состав</p>
              <h2>Структура площадей и сценарии использования</h2>
              <p>АБК не вынесен отдельным помещением на этой странице, чтобы не дублировать предложение второго этажа. Он показан как функциональная зона в составе объекта.</p>
            </div>
            <div class="nkr-composition-grid">
              <div class="nkr-breakdown reveal">
                <div class="nkr-breakdown-total"><span>Арендопригодная площадь</span><strong>5 188,73 м²</strong></div>
                ${nkrBreakdown.map(([label, area, percent]) => `
                  <article class="nkr-breakdown-row">
                    <div><strong>${area}</strong><span>${label}</span></div>
                    <em>${percent}</em>
                    <i style="--progress:${percent}"></i>
                  </article>
                `).join("")}
              </div>
              <div class="nkr-plan-grid">
                ${nkrLevels.map((item) => `
                  <article class="nkr-plan-card reveal">
                    <div class="nkr-plan-card-top">
                      <div class="nkr-plan-card-head">
                        <span>${item.level}</span>
                        <strong>${item.area}</strong>
                      </div>
                      <div class="nkr-plan-card-icon" aria-hidden="true">
                        <img src="${item.icon}" alt="">
                      </div>
                    </div>
                    <div class="nkr-plan-card-copy">
                      <b>${item.role}</b>
                      <p>${item.summary}</p>
                    </div>
                    <div class="nkr-plan-chip-row">
                      ${item.chips.map((chip) => `<span class="nkr-plan-chip">${chip}</span>`).join("")}
                    </div>
                  </article>
                `).join("")}
              </div>
            </div>
          </section>

          <section class="nkr-section" id="nkr-location">
            <div class="section-head">
              <p class="eyebrow">Локация</p>
              <h2>Преимущества локации для логистики</h2>
              <p>Объект расположен в промышленном кластере на юго-востоке Московской агломерации. Доступ к направлениям Вешняки–Люберцы, Московскому скоростному диаметру и далее М-12 усиливает логистический сценарий, а близость ТПУ «Некрасовка» и станции Люберцы II повышает удобство для персонала.</p>
            </div>
            <div class="nkr-location-grid">
              <div class="nkr-map-card reveal">
                <iframe title="Яндекс.Карта: Промтехнопарк «Некрасовка»" src="${yandexMapUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
              <aside class="nkr-location-card reveal">
                <p class="eyebrow">Адрес</p>
                <h3>Москва, район Некрасовка</h3>
                <p>Пересечение проектируемых проездов 83 и 4296</p>
                <p class="nkr-coords">55.676544, 37.930757</p>
                <a class="btn btn-dark" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
              </aside>
            </div>
          </section>

          <section class="nkr-section" id="nkr-roadmap">
            <div class="section-head">
              <p class="eyebrow">Дорожная карта</p>
              <h2>Ожидаемая динамика стоимости</h2>
              <p>Коммерческая модель привязана к стадиям проекта: от текущего этапа и получения РНС до активной стройки, готовности контура и ввода в эксплуатацию.</p>
            </div>
            <div class="nkr-roadmap nkr-roadmap--timeline">
              ${nkrRoadmap.map(([date, title, note], index) => `
                <article class="nkr-roadmap-item reveal">
                  <strong>${date}</strong>
                  <span aria-hidden="true"></span>
                  <h3>${title}</h3>
                  <p>${note}</p>
                </article>
              `).join("")}
            </div>
            <div class="nkr-dynamics-grid">
              ${[["Аренда", "ставка за здание целиком, ₽/м²/год без НДС", rentDynamics], ["Продажа", "цена за здание целиком, ₽/м² без НДС", saleDynamics]].map(([title, subtitle, rows]) => `
                <article class="nkr-dynamic-card reveal">
                  <p class="eyebrow">${title}</p>
                  <h3>${subtitle}</h3>
                  <div class="nkr-dynamic-chart">
                    ${rows.map(([date, value, growth], index) => `
                      <div class="nkr-dynamic-bar" style="--level:${toDynamicsLevel(rows, value)}">
                        <span class="nkr-dynamic-value"><strong>${value}</strong><em class="${String(growth).startsWith("+") ? "is-growth" : ""}">${growth}</em></span>
                        <i aria-hidden="true"></i>
                        <span>${date}</span>
                      </div>
                    `).join("")}
                  </div>
                </article>
              `).join("")}
            </div>
            <div class="nkr-dynamics-note reveal"><strong>РНС — июнь 2026</strong><span>аренда: 15 500 → 19 375 ₽/м²/год</span><span>продажа: 200 000 → 280 000 ₽/м² без НДС</span><strong>только целиком</strong></div>
          </section>

          <section class="nkr-section" id="nkr-terms">
            <div class="section-head">
              <p class="eyebrow">Аренда / продажа</p>
              <h2>Коммерческие условия без лишнего дубляжа</h2>
              <p>Здание целиком показано как один физический объект с двумя сценариями сделки: аренда и покупка. Отдельная продажа этажей и блоков не предусмотрена.</p>
            </div>
            <div class="nkr-commercial-grid">
              <article class="nkr-commercial-card reveal">
                <p class="eyebrow">Аренда</p>
                <div class="nkr-rent-board">
                  <div class="nkr-rent-hero">
                    <h3>Целиком здание</h3>
                    <div class="nkr-price-row"><strong>5 507 м²</strong><span>15 500 ₽/м²/год</span></div>
                    <div class="nkr-rent-hero-meta"><strong>Срок аренды 5–7 лет</strong><span>Обеспечительный платёж 2 месяца</span></div>
                  </div>
                  <div class="nkr-rent-tiles">
                    ${rentTerms.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong></div>`).join("")}
                  </div>
                </div>
              </article>
              <article class="nkr-commercial-card reveal">
                <p class="eyebrow">Поэтажная аренда</p>
                <h3>3–5 лет · возможна нарезка на автономные блоки</h3>
                <div class="nkr-mini-table">
                  <div><span>Этаж</span><span>Площадь</span><span>Высота</span><span>Нагрузка</span><span>Ставка</span></div>
                  ${floorRent.map((row) => `<div>${row.map((cell) => `<span>${cell}</span>`).join("")}</div>`).join("")}
                </div>
              </article>
              <article class="nkr-commercial-card nkr-commercial-card--wide reveal">
                <p class="eyebrow">Продажа</p>
                <h3>Покупка только здания целиком</h3>
                <div class="nkr-sale-board">
                  <div class="nkr-sale-top">
                    <div class="nkr-sale-panel nkr-sale-panel--object">
                      <span>Объект</span>
                      <strong>Промышленный парк в Некрасовке</strong>
                      <div class="nkr-sale-panel-metrics">
                        <div><span>Площадь здания</span><strong>5 507 м²</strong></div>
                        <div><span>Цена продажи</span><strong>200 000 ₽/м²</strong></div>
                      </div>
                      <div class="nkr-sale-panel-tags"><span>РНС — июнь 2026</span><span>Ввод IV кв. 2027</span></div>
                    </div>
                    <div class="nkr-sale-panel nkr-sale-panel--scenario">
                      <span>Цена продажи, ₽/м² без НДС</span>
                      <strong>1 101 400 000</strong>
                      <div class="nkr-sale-scenario">
                        <span>Сценарий</span>
                        <p>5% по ПДКП; после получения РНС — заключение ДКПБВ и 30%; далее — 4 равных платежа до закрытия сделки.</p>
                        <div class="nkr-sale-scenario-steps"><span>5%</span><span>30%</span><span>4 × 16,25%</span></div>
                      </div>
                    </div>
                  </div>
                  <div class="nkr-payment-shell">
                    <div class="nkr-payment-heading"><strong>График платежей</strong><span>Все суммы указаны без НДС</span></div>
                    <div class="nkr-payment-table nkr-payment-table--sale">
                      <div><span>Этап</span><span>Дата</span><span>Доля</span><span>Платеж, ₽</span><span>Оплачено накопленным итогом, ₽</span><span>Остаток к оплате, ₽</span></div>
                      ${paymentPlan.map(([stage, date, share, payment, paid, rest], index) => `
                        <div class="${share === "—" ? "is-muted" : ""}">
                          <span><i class="${index < 3 ? "is-red" : ""}" aria-hidden="true"></i>${stage}</span>
                          <span>${date}</span>
                          <span>${share === "—" ? "—" : `<b>${share}</b>`}</span>
                          <span class="nkr-payment-value">${payment}<em style="--bar:${toPaymentProgress(payment)}"></em></span>
                          <span class="nkr-payment-value">${paid}<em class="is-paid" style="--bar:${toPaymentProgress(paid)}"></em></span>
                          <span class="nkr-payment-value">${rest}<em class="is-rest" style="--bar:${toPaymentProgress(rest)}"></em></span>
                        </div>
                      `).join("")}
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section class="nkr-section" id="nkr-lots">
            <div class="section-head">
              <p class="eyebrow">Предложения</p>
              <h2>Свободные площади промтехнопарка «Некрасовка»</h2>
            </div>
            <div class="nkr-offer-grid">
              ${uniqueOffers.map((offer) => `
                <article class="nkr-offer-card reveal">
                  ${getOfferMediaMarkup(offer)}
                  <div>
                    <p class="eyebrow">${offer.buyLot ? "Аренда · Покупка" : "Аренда"}</p>
                    <h3>${offer.title}</h3>
                    <p>${offer.subtitle}</p>
                    <strong>${offer.area}</strong>
                    <ul>${offer.meta.map((item) => `<li>${item}</li>`).join("")}</ul>
                  </div>
                  <div class="nkr-offer-actions">
                    ${offer.rentLot ? `<button class="btn btn-dark" type="button" data-open-lot="${offer.rentLot}">${offer.rent || "Аренда"}</button>` : ""}
                    ${offer.buyLot ? `<button class="btn btn-ghost" type="button" data-open-lot="${offer.buyLot}">${offer.buy || "Покупка"}</button>` : ""}
                  </div>
                </article>
              `).join("")}
            </div>
            <div class="rule-block nkr-rule-block reveal">
              <h3>Правило сделки</h3>
              <p>Аренда возможна зданием целиком или по уровням. Покупка доступна только целиком (NKR-SALE-01) — без продажи отдельных этажей и без дублей внутри страницы.</p>
              <div class="section-actions"><a class="btn btn-dark" href="lots.html?deal=rent&object=nekrasovka">Открыть аренду в каталоге</a><a class="btn btn-ghost" href="lots.html?deal=buy&object=nekrasovka">Открыть покупку в каталоге</a></div>
            </div>
          </section>
        </section>
      `;
      return;
    }

    if (id === "grekova") {
      const grekovaKpis = [
        ["3 695,89 м²", "общая площадь по ТЭП"],
        ["2 619,78 м²", "арендуемые помещения"],
        ["894,80 м²", "МОП по всем уровням"],
        ["IV кв. 2027", "РНС — ключевая дата"]
      ];

      const grekovaSpecs = [
        ["Общая площадь", "3 695,89 м²", "уточненный показатель по ТЭП"],
        ["Наземная нежилая", "2 765,01 м²", "1–3 этажи под медицинские функции"],
        ["Подземная нежилая", "930,88 м²", "-1 этаж с техническими помещениями, МОП и арендуемыми площадями"],
        ["СПП в ГНС", "3 002,31 м²", "суммарная поэтажная площадь"],
        ["Площадь застройки", "1 062,45 м²", "компактный отдельно стоящий объект"],
        ["Классифицированная площадь", "3 618,29 м²", "технические помещения, МОП и арендуемые помещения"]
      ];

      const grekovaFloors = [
        ["-1", "500,38 м²", "Арендуемые помещения сервисного уровня", "Дополнительно: технические помещения 103,71 м² и МОП 296,84 м²."],
        ["1", "703,38 м²", "Входная группа и амбулаторно-консультационный блок", "Дополнительно: МОП 202,38 м². Первая линия, пациентский поток и street-retail сценарий."],
        ["2", "708,01 м²", "ЛФК и восстановительные программы", "Дополнительно: МОП 197,79 м². Пространства для реабилитации и профильных программ."],
        ["3", "708,01 м²", "Индивидуальные занятия и специализированные услуги", "Дополнительно: МОП 197,79 м². Специализированные услуги и кабинеты индивидуальной работы."]
      ];


      const grekovaLocation = [
        ["Юг", "станция метро «Медведково»"],
        ["Восток", "ул. Грекова и первая линия"],
        ["Запад", "жилая многоэтажная застройка"],
        ["Север", "открытая автостоянка"]
      ];

      const grekovaRoadmap = [
        ["24.05.2024", "ГПЗУ", "Градостроительный план земельного участка получен как базовый документ проекта."],
        ["31.01.2026", "АГР", "Текущая публичная стадия согласования архитектурно-градостроительного решения."],
        ["IV кв. 2027", "РНС", "Ключевая дата: получение разрешения на строительство."],
        ["Далее", "Реализация", "Строительство, ввод и запуск медицинского операционного сценария."]
      ];

      const grekovaRentTerms = [
        ["Здание целиком", "3 695,89 м²", "26 000 ₽/м²/год"],
        ["-1 этаж", "500,38 м²", "18 000 ₽/м²/год"],
        ["1 этаж / street retail", "703,38 м²", "60 000 ₽/м²/год"],
        ["2 этаж", "708,01 м²", "36 000 ₽/м²/год"],
        ["3 этаж", "708,01 м²", "36 000 ₽/м²/год"]
      ];

      const grekovaInvestment = [
        ["1,11 млрд ₽", "ориентир стоимости покупки"],
        ["102,2 млн ₽/год", "потенциальный валовый поток по поэтажной аренде"],
        ["≈9,2%", "валовая доходность"],
        ["≈7,6%", "ориентир NOI yield после OPEX"]
      ];

      const exitScenarios = [
        ["Консервативный", "1,22 млрд ₽", "330 000 ₽/м²"],
        ["Базовый", "1,31 млрд ₽", "354 000 ₽/м²"],
        ["Оптимистичный", "1,39 млрд ₽", "375 000 ₽/м²"]
      ];

      const yandexMapUrl = "https://yandex.ru/map-widget/v1/?ll=37.661722%2C55.888667&z=16&l=map&pt=37.661722,55.888667,pm2rdm";
      const rentLots = lots.filter((lot) => lot.deal === "rent");
      const saleLots = lots.filter((lot) => lot.deal === "buy");

      target.innerHTML = `
        <section class="object-hero section-dark grekova-hero">
          <div class="object-hero-media"><img src="${object.image}" alt="${object.title}" fetchpriority="high"></div>
          <div class="object-hero-content">
            <p class="eyebrow">Отдельно стоящее здание медицинского назначения · Северное Медведково</p>
            <h1>Медицинский центр на первой линии у метро «Медведково»</h1>
            <p>Объект на ул. Грекова, 5–7 рассчитан на медицинского оператора, клинику, реабилитационные и амбулаторные сценарии. Доступна аренда здания целиком и блоками, а покупка предусмотрена только объектом целиком.</p>
            <div class="hero-labels"><span>3 695,89 м²</span><span>2 619,78 м² арендуемые</span><span>РНС IV кв. 2027</span><span>метро 290 м</span></div>
            <div class="hero-actions">
              <a class="btn btn-primary" href="#grekova-lots">Смотреть предложения</a>
              <a class="btn btn-ghost" href="#grekova-investment">Инвестмодель</a>
              <a class="btn btn-ghost" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
              <button class="btn btn-ghost" type="button" data-open-request data-building="${object.id}" data-context="Грекова · медицинский центр">Оставить заявку</button>
            </div>
          </div>
        </section>

        <section class="object-content nkr-page grekova-page">
          <nav class="nkr-subnav reveal" aria-label="Разделы страницы медицинского центра">
            <a href="#grekova-about">О проекте</a>
            <a href="#grekova-specs">Параметры</a>
            <a href="#grekova-floors">Этажи</a>
            <a href="#grekova-location">Локация</a>
            <a href="#grekova-roadmap">График</a>
            <a href="#grekova-terms">Условия</a>
            <a href="#grekova-investment">Инвестмодель</a>
            <a href="#grekova-lots">Помещения</a>
          </nav>

          <section class="nkr-section grekova-overview" id="grekova-about">
            <div class="section-head">
              <p class="eyebrow">О проекте</p>
              <h2>Медицинский формат в сложившемся жилом районе</h2>
              <p>Отдельно стоящее здание медицинского назначения расположено на первой линии ул. Грекова в районе Северное Медведково. Южная граница участка ориентирована на станцию метро «Медведково», что формирует понятный доступ для пациентов и персонала.</p>
            </div>
            <div class="nkr-kpi-grid">
              ${grekovaKpis.map(([value, label]) => `<article class="nkr-glass-card reveal"><strong>${value}</strong><span>${label}</span></article>`).join("")}
            </div>
          </section>

          <section class="nkr-section" id="grekova-specs">
            <div class="section-head">
              <p class="eyebrow">Ключевые параметры</p>
              <h2>ТЭП и структура площадей</h2>
              <p>Параметры обновлены по ТЭП: отдельно показаны общая площадь, наземная и подземная нежилая площадь, СПП в ГНС, площадь застройки и классифицированные площади по функциям.</p>
            </div>
            <div class="nkr-levels grekova-spec-grid">
              ${grekovaSpecs.map(([label, value, note]) => `
                <article class="nkr-level-card reveal">
                  <span>${label}</span>
                  <strong>${value}</strong>
                  <p>${note}</p>
                </article>
              `).join("")}
            </div>
            <div class="rule-block nkr-rule-block reveal">
              <h3>Благоустройство территории</h3>
              <p>Проект включает полное озеленение, пешеходные зоны, организованную парковку, доступную среду и два въезда через шлагбаумы с шириной проезда 6,0 м каждый.</p>
            </div>
          </section>

          <section class="nkr-section" id="grekova-floors">
            <div class="section-head">
              <p class="eyebrow">Профиль площадей по этажам</p>
              <h2>Четыре уровня под медицинскую функцию</h2>
              <p>Профиль этажей обновлен по планировкам. Сами планировки перенесены в карточки соответствующих помещений ниже, чтобы пользователь сразу видел схему конкретного предложения и не сравнивал этажи отдельно от помещений.</p>
            </div>
            <div class="nkr-plan-grid grekova-floor-grid">
              ${grekovaFloors.map(([level, area, title, note]) => `
                <article class="nkr-plan-card reveal">
                  <span>${level} этаж</span>
                  <strong>${area}</strong>
                  <h3>${title}</h3>
                  <p>${note}</p>
                </article>
              `).join("")}
            </div>
          </section>

          <section class="nkr-section" id="grekova-location">
            <div class="section-head">
              <p class="eyebrow">Локация</p>
              <h2>Первая линия у метро и высокий фасадный потенциал</h2>
              <p>Станция метро «Медведково» находится у южной границы участка. Объект стоит в сложившемся жилом районе с развитой инфраструктурой, что подходит для медицинского трафика и регулярных визитов пациентов.</p>
            </div>
            <div class="nkr-location-grid">
              <div class="nkr-map-card reveal">
                <iframe title="Яндекс.Карта: медицинский центр на ул. Грекова" src="${yandexMapUrl}" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
              </div>
              <aside class="nkr-location-card reveal">
                <p class="eyebrow">Адрес объекта</p>
                <h3>Москва, ул. Грекова, 5–7</h3>
                <p>Район Северное Медведково, СВАО</p>
                <p class="nkr-coords">55.8886667, 37.6617222</p>
                <div class="grekova-surroundings">
                  ${grekovaLocation.map(([side, text]) => `<div><span>${side}</span><strong>${text}</strong></div>`).join("")}
                </div>
                <a class="btn btn-dark" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
              </aside>
            </div>
          </section>

          <section class="nkr-section" id="grekova-roadmap">
            <div class="section-head">
              <p class="eyebrow">График реализации</p>
              <h2>От ГПЗУ к разрешению на строительство</h2>
              <p>Ключевая дата проекта — получение РНС в августе 2026 года. После этого сценарий переходит в реализацию, строительство и ввод.</p>
            </div>
            <div class="nkr-roadmap grekova-roadmap">
              ${grekovaRoadmap.map(([date, title, note], index) => `
                <article class="nkr-roadmap-item reveal ${index === 2 ? "is-current" : ""}">
                  <span>0${index + 1}</span>
                  <strong>${date}</strong>
                  <h3>${title}</h3>
                  <p>${note}</p>
                </article>
              `).join("")}
            </div>
          </section>

          <section class="nkr-section" id="grekova-terms">
            <div class="section-head">
              <p class="eyebrow">Продажа / аренда</p>
              <h2>Коммерческие условия без дублей</h2>
              <p>Аренда возможна зданием целиком или по отдельным уровням. Продажа отдельных этажей не предусмотрена: объект продается только целиком, а проект с РНС за 200 млн ₽ показан как отдельный формат сделки.</p>
            </div>
            <div class="nkr-commercial-grid">
              <article class="nkr-commercial-card reveal">
                <p class="eyebrow">Продажа здания целиком</p>
                <h3>300 000 ₽/м²</h3>
                <ul class="detail-list">
                  <li>предмет сделки: отдельно стоящее здание медицинского назначения</li>
                  <li>общая площадь по ТЭП: 3 695,89 м²</li>
                  <li>арендуемые помещения: 2 619,78 м²</li>
                  <li>земельный участок: 5 200 м²</li>
                  <li>назначение: медицинское</li>
                  <li>договорная модель и график платежей — по согласованию сторон</li>
                </ul>
                <a class="btn btn-dark" href="lots.html?deal=buy&object=grekova">Открыть покупку в каталоге</a>
              </article>
              <article class="nkr-commercial-card reveal">
                <p class="eyebrow">Проект с РНС</p>
                <h3>200 млн ₽</h3>
                <p>Отдельный формат предложения. Не добавлен в каталог как помещение, чтобы не дублировать продажу здания целиком.</p>
                <ul class="detail-list">
                  <li>основной формат — продажа объекта целиком</li>
                  <li>проект с РНС — отдельный сценарий сделки</li>
                  <li>структура расчетов — по согласованию сторон</li>
                </ul>
              </article>
            </div>
            <div class="nkr-terms-table grekova-rent-table reveal">
              <div class="nkr-terms-head"><span>Формат аренды</span><span>Площадь</span><span>Базовая ставка</span></div>
              ${grekovaRentTerms.map(([format, area, rate]) => `<div><strong>${format}</strong><span>${area}</span><em>${rate}</em></div>`).join("")}
            </div>
            <div class="rule-block nkr-rule-block reveal">
              <h3>Условия договора</h3>
              <p>Долгосрочный договор, индексация 7% со второго года, передача в состоянии Shell & Core, эксплуатационные расходы 5 000 ₽/м²/год. Арендуемая площадь по этажам: -1 этаж — 500,38 м², 1 этаж — 703,38 м², 2 и 3 этажи — по 708,01 м².</p>
            </div>
          </section>

          <section class="nkr-section grekova-investment" id="grekova-investment">
            <div class="section-head">
              <p class="eyebrow">Инвестиционная модель</p>
              <h2>Сценарий доходного медицинского актива</h2>
              <p>Объект может работать как площадка для конечного пользователя или как доходный арендный актив с подбором медицинского оператора / нескольких арендаторов.</p>
            </div>
            <div class="nkr-kpi-grid grekova-investment-grid">
              ${grekovaInvestment.map(([value, label]) => `<article class="nkr-glass-card reveal"><strong>${value}</strong><span>${label}</span></article>`).join("")}
            </div>
            <div class="nkr-dynamics-grid grekova-exit-grid">
              ${exitScenarios.map(([title, value, rate]) => `
                <article class="nkr-dynamic-card reveal">
                  <p class="eyebrow">${title}</p>
                  <h3>${value}</h3>
                  <p>${rate}</p>
                </article>
              `).join("")}
            </div>
            <div class="rule-block nkr-rule-block reveal">
              <h3>Этапы инвестиционного цикла</h3>
              <p>Вход через покупку по 300 000 ₽/м², заполнение медицинским оператором или несколькими арендаторами, стабилизация арендного потока и последующий выход через продажу готового актива или рефинансирование. Расчеты приведены по обновленной общей площади 3 695,89 м² и поэтажной арендуемой площади 2 619,78 м².</p>
            </div>
          </section>

          <section class="nkr-section" id="grekova-lots">
            <div class="section-head">
              <p class="eyebrow">Помещения и сценарии</p>
              <h2>Аренда блоками, аренда целиком и покупка только целиком</h2>
              <p>Помещения не дублируют друг друга: поэтажные блоки показывают арендную экспозицию, а покупка здания целиком вынесена отдельным сценарием без продажи отдельных этажей.</p>
            </div>
            <div class="section-head section-head-compact">
              <p class="eyebrow">Аренда</p>
              <h3>5 арендных предложений</h3>
            </div>
            <div class="lot-grid">${rentLots.map(lotCard).join("")}</div>
            <div class="section-head section-head-compact grekova-buy-head">
              <p class="eyebrow">Покупка</p>
              <h3>Продажа только здания целиком</h3>
            </div>
            <div class="lot-grid">${saleLots.map(lotCard).join("")}</div>
          </section>
        </section>
      `;
      return;
    }

    target.innerHTML = `
      <section class="object-hero section-dark">
        <div class="object-hero-media"><img src="${object.image}" alt="${object.title}" fetchpriority="high"></div>
        <div class="object-hero-content">
          <p class="eyebrow">${isMitino ? "Объект ABCENTRUM" : id === "nekrasovka" ? "Промышленный парк" : "Медицинский объект"}</p>
          <h1>${object.title}</h1>
          <p>${object.description}</p>
          <div class="hero-labels"><span>${object.areaLabel}</span><span>${object.stageLabel}</span><span>${object.keyDateLabel}</span></div>
          <div class="hero-actions">
            <a class="btn btn-primary" href="lots.html?deal=rent&object=${object.id}">Свободные площади</a>
            ${object.deals.includes("buy") ? `<a class="btn btn-ghost" href="lots.html?deal=buy&object=${object.id}">Покупка здания целиком</a>` : ""}
            <a class="btn btn-ghost" href="${getRouteUrl(object.id)}" target="_blank" rel="noopener noreferrer">Проложить маршрут</a>
            <button class="btn btn-ghost" type="button" data-open-request data-building="${object.id}" data-context="Подбор помещения">Оставить заявку</button>
          </div>
        </div>
      </section>
      <section class="object-content">
        <div class="object-layout">
          <aside class="rule-block">
            <p class="eyebrow">Ключевые факты</p>
            <ul class="detail-list">${object.metrics.map((item) => `<li>${item}</li>`).join("")}</ul>
          </aside>
          <div>
            <div class="section-head">
              <p class="eyebrow">Помещения</p>
              <h2>${isMitino ? "Свободные площади промтехнопарка «Митино»" : id === "nekrasovka" ? "Свободные площади промтехнопарка «Некрасовка»" : "Свободные площади медицинского центра «Грекова»"}</h2>
              <p>${isMitino ? "7 арендных предложений: общепит, showroom, производство, офисы и мезонинные блоки." : id === "nekrasovka" ? "5 предложений: аренда здания целиком, аренда отдельных уровней и покупка промышленного парка только целиком." : "6 предложений: аренда здания целиком, аренда блоков по уровням и покупка медицинского объекта только целиком."}</p>
            </div>
            <div class="lot-grid">${lots.map(lotCard).join("")}</div>
          </div>
        </div>
        <div class="rule-block" style="margin-top:34px">
          <h3>${isMitino ? "Промтехнопарк «Митино» — только аренда" : id === "nekrasovka" ? "Некрасовка — продажа только целиком" : "Грекова — медицинский объект, продажа только целиком"}</h3>
          <p>${isMitino ? "При выборе покупки объект не отображается. В каталоге доступны только арендные помещения B37A-01 — B37A-07." : id === "nekrasovka" ? "Аренда возможна целиком или по уровням, покупка — только целиком (NKR-SALE-01), без продажи отдельных этажей." : "Аренда возможна целиком и блоками, покупка — только целиком (GRK-SALE-01), без продажи отдельных этажей."}</p>
        </div>
      </section>
    `;
  }

  function setMobileMenu(open) {
    const header = document.querySelector("[data-header]");
    const menuButton = document.querySelector("[data-menu-toggle]");
    header?.classList.toggle("is-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
  }

  function bindGlobalClicks() {
    document.addEventListener("click", (event) => {
      const closeModalButton = event.target.closest("[data-close-modal]");
      if (closeModalButton) {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
        return;
      }

      if (event.target.matches("[data-request-modal]")) {
        event.preventDefault();
        event.stopPropagation();
        closeModal();
        return;
      }

      const closeDrawerButton = event.target.closest("[data-close-drawer]");
      if (closeDrawerButton) {
        event.preventDefault();
        event.stopPropagation();
        closeDrawer();
        return;
      }

      if (event.target.matches("[data-lot-drawer]")) {
        event.preventDefault();
        event.stopPropagation();
        closeDrawer();
        return;
      }

      const menuToggle = event.target.closest("[data-menu-toggle]");
      if (menuToggle) {
        event.preventDefault();
        event.stopPropagation();
        const header = document.querySelector("[data-header]");
        setMobileMenu(!header?.classList.contains("is-open"));
        return;
      }

      const openedHeader = document.querySelector("[data-header].is-open");
      if (openedHeader && !event.target.closest("[data-header]")) {
        setMobileMenu(false);
      }

      if (event.target.closest(".nav-links a")) setMobileMenu(false);

      const lotButton = event.target.closest("[data-open-lot]");
      if (lotButton) {
        event.preventDefault();
        openLotDrawer(lotButton.dataset.openLot);
        return;
      }

      const requestButton = event.target.closest("[data-open-request]");
      if (requestButton) {
        event.preventDefault();
        event.stopPropagation();
        setMobileMenu(false);
        openRequestModal(requestButton.dataset);
        return;
      }

      const favoriteButton = event.target.closest("[data-favorite]");
      if (favoriteButton) {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(favoriteButton.dataset.favorite);
      }
    });
  }

  function openLotDrawer(id) {
    const lot = data.lots.find((item) => item.id === id);
    const drawer = document.querySelector("[data-lot-drawer]");
    if (!lot || !drawer) return;
    const object = objectById[lot.building];
    const dealLabel = lot.deal === "rent" ? "Аренда" : "Покупка";
    const media = getLotMedia(lot, object);
    drawer.innerHTML = `
      <div class="drawer-panel">
        <button class="drawer-close drawer-close--icon" type="button" data-close-drawer aria-label="Закрыть карточку помещения"><span class="menu-toggle-line" aria-hidden="true"></span><span class="menu-toggle-line" aria-hidden="true"></span><span class="menu-toggle-line" aria-hidden="true"></span></button>
        <p class="eyebrow">${object.shortTitle} · ${dealLabel}</p>
        <h2>${lot.id} · ${lot.type}</h2>
        <div class="drawer-image ${media.isPlan ? "drawer-image--plan" : ""}"><img src="${media.src}" alt="${media.alt}" loading="lazy"></div>
        <div class="facts-grid">
          ${[
            ["ID помещения", lot.id], ["Объект", object.title], ["Сделка", dealLabel], ["Тип", lot.type],
            ["Подтип", lot.subType], ["Категория", formatLabel(lot.category)], ["Площадь", formatArea(lot.area)],
            ["Этаж", lot.floor], [getHeightLabel(lot), getHeightValue(lot)], [lot.deal === "buy" ? "Цена" : "Ставка", lot.rate],
            ["Состояние", lot.condition], ["Статус", statusLabel(lot.status)]
          ].map(([label, value]) => `<div class="fact-card"><p class="eyebrow">${label}</p><strong>${value}</strong></div>`).join("")}
        </div>
        <h3>Назначение</h3><p>${lot.purpose}</p>
        <h3>Коммерческие условия</h3><ul class="terms-list">${lot.commercialTerms.map((item) => `<li>${item}</li>`).join("")}</ul>
        <h3>Highlights</h3><ul class="terms-list">${lot.highlights.map((item) => `<li>${item}</li>`).join("")}</ul>
        <div class="section-actions">
          <button class="btn btn-dark" type="button" data-open-request data-building="${lot.building}" data-lot="${lot.id}" data-context="Запрос условий">Оставить заявку</button>
          <button class="favorite-btn ${getFavorites().includes(lot.id) ? "is-active" : ""}" type="button" data-favorite="${lot.id}" aria-label="Избранное">${renderFavoriteIcon(getFavorites().includes(lot.id))}</button>
        </div>
        <div class="contact-links">
          <a href="${data.contacts.phoneHref}">${data.contacts.phone}</a>
          <a href="${data.contacts.emailHref}">${data.contacts.email}</a>
          <a href="${data.contacts.telegramHref}">${data.contacts.telegram}</a>
        </div>
      </div>
    `;
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");
    drawer.querySelector("[data-close-drawer]")?.focus();
  }

  function closeDrawer() {
    const drawer = document.querySelector("[data-lot-drawer]");
    drawer?.classList.remove("is-open");
    drawer?.setAttribute("aria-hidden", "true");
    if (!document.querySelector("[data-request-modal]")?.classList.contains("is-open")) document.body.classList.remove("is-modal-open");
  }

  function renderRequestModal() {
    const modal = document.querySelector("[data-request-modal]");
    if (!modal) return;
    modal.innerHTML = `<div class="modal-panel"><button class="modal-close modal-close--icon" type="button" data-close-modal aria-label="Закрыть форму"><span class="menu-toggle-line" aria-hidden="true"></span><span class="menu-toggle-line" aria-hidden="true"></span><span class="menu-toggle-line" aria-hidden="true"></span></button><div data-request-form></div></div>`;
  }

  function openRequestModal(context = {}) {
    const modal = document.querySelector("[data-request-modal]");
    const formHost = document.querySelector("[data-request-form]");
    if (!modal || !formHost) return;
    const building = context.building || "";
    const lot = context.lot || "";
    const favoriteIds = getFavorites();
    formHost.innerHTML = `
      <p class="eyebrow">Заявка ABCENTRUM</p>
      <h2>Оставить заявку</h2>
      <p>Оставьте минимум контактов. В заявке автоматически передадим выбранный объект, помещение и избранные предложения.</p>
      <form class="request-form" data-request-form-submit>
        <label class="field">Имя *<input name="name" required autocomplete="name"></label>
        <label class="field">Телефон *<input name="phone" required autocomplete="tel"></label>
        <label class="field">Объект
          <select name="building">
            <option value="">Не выбран</option>
            ${data.objects.map((object) => `<option value="${object.id}" ${object.id === building ? "selected" : ""}>${object.title}</option>`).join("")}
          </select>
        </label>
        <label class="field">Помещение<input name="lot" value="${lot}" ${lot ? "readonly" : ""} placeholder="Например, B37A-04"></label>
        <label class="field">Комментарий<textarea name="comment">${context.context || (favoriteIds.length ? `Избранные помещения: ${favoriteIds.join(", ")}` : "Запрос коммерческих условий")}</textarea></label>
        <label class="checkbox-field"><input name="consent" type="checkbox" required> Согласен на обработку персональных данных *</label>
        <p class="form-error" data-form-error></p>
        <button class="btn btn-dark" type="submit">Отправить заявку</button>
        <div class="form-success" data-form-success hidden></div>
      </form>
    `;
    formHost.querySelector("[data-request-form-submit]").addEventListener("submit", submitRequestForm);
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("is-modal-open");
    formHost.querySelector("input[name='name']")?.focus();
  }

  async function submitRequestForm(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    const error = form.querySelector("[data-form-error]");
    const success = form.querySelector("[data-form-success]");
    error.textContent = "";
    success.hidden = true;
    if (!values.name) return error.textContent = "Укажите имя.";
    if (!values.phone) return error.textContent = "Укажите телефон.";
    if (!form.elements.consent.checked) return error.textContent = "Нужно согласие на обработку персональных данных.";

    const payload = {
      name: values.name,
      phone: values.phone,
      building: objectById[values.building]?.title || "не выбран",
      lot: values.lot || "не выбран",
      comment: values.comment || "без комментария",
      favorites: getFavorites(),
      page: window.location.href,
      createdAt: new Date().toISOString()
    };

    try {
      localStorage.setItem("abcentrum:lastRequest", JSON.stringify(payload));
    } catch (error) {}

    if (data.contacts.formEndpoint) {
      try {
        const response = await fetch(data.contacts.formEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error("request failed");
        success.innerHTML = "Заявка отправлена. Менеджер свяжется с вами по указанному телефону.";
        success.hidden = false;
        form.reset();
        return;
      } catch (requestError) {
        error.textContent = "Автоматическая отправка временно недоступна. Используйте быстрые контакты ниже.";
      }
    }

    const text = [
      "Заявка ABCENTRUM",
      `Имя: ${payload.name}`,
      `Телефон: ${payload.phone}`,
      `Объект: ${payload.building}`,
      `Помещение: ${payload.lot}`,
      `Избранное: ${payload.favorites.join(", ") || "нет"}`,
      `Комментарий: ${payload.comment}`,
      `Страница: ${payload.page}`
    ].join("%0A");
    const emailHref = `mailto:${data.contacts.email}?subject=${encodeURIComponent("Заявка ABCENTRUM")}&body=${text}`;
    success.innerHTML = `
      <strong>Заявка подготовлена.</strong>
      <span>Передайте её менеджеру быстрым способом:</span>
      <div class="form-success-actions">
        <a class="btn btn-dark" href="${data.contacts.telegramHref}" target="_blank" rel="noopener noreferrer">Написать в Telegram</a>
        <a class="btn btn-ghost" href="${data.contacts.phoneHref}">Позвонить</a>
        <a class="btn btn-ghost" href="${emailHref}">Отправить email</a>
      </div>
    `;
    success.hidden = false;
  }

  function closeModal() {
    const modal = document.querySelector("[data-request-modal]");
    modal?.classList.remove("is-open");
    modal?.setAttribute("aria-hidden", "true");
    if (!document.querySelector("[data-lot-drawer]")?.classList.contains("is-open")) document.body.classList.remove("is-modal-open");
  }

  function getFavorites() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || "[]");
      return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
    } catch {
      return [];
    }
  }

  function toggleFavorite(id) {
    const favs = getFavorites();
    const next = favs.includes(id) ? favs.filter((item) => item !== id) : [...favs, id];
    localStorage.setItem(storageKey, JSON.stringify(next));
    updateFavoriteCount();
    if (page === "catalog") renderCatalogLots();
    document.querySelectorAll(`[data-favorite="${id}"]`).forEach((button) => {
      const active = next.includes(id);
      button.classList.toggle("is-active", active);
      button.textContent = renderFavoriteIcon(active);
    });
  }

  function updateFavoriteCount() {
    document.querySelectorAll("[data-fav-count]").forEach((item) => item.textContent = getFavorites().length);
  }

  function renderContactLinks() {
    const target = document.querySelector("[data-contact-links]");
    if (!target) return;
    target.innerHTML = `
      <a href="${data.contacts.phoneHref}"><span>Телефон</span><strong>${data.contacts.phone}</strong></a>
      <a href="${data.contacts.grekovaPhoneHref}"><span>Объект на Грекова</span><strong>${data.contacts.grekovaPhone}</strong></a>
      <a href="${data.contacts.emailHref}"><span>Email</span><strong>${data.contacts.email}</strong></a>
      <a href="${data.contacts.telegramHref}"><span>Telegram</span><strong>${data.contacts.telegram}</strong></a>
    `;
  }

  function initHeroRotation() {
    const images = [...document.querySelectorAll("[data-hero-image]")];
    if (!images.length) return;
    let index = 0;
    window.setInterval(() => {
      images[index].classList.remove("is-active");
      index = (index + 1) % images.length;
      images[index].classList.add("is-active");
    }, 5200);
  }

  function bindKeyboard() {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      closeModal();
      closeDrawer();
      setMobileMenu(false);
    });
  }

  function initHeaderState() {
    const header = document.querySelector("[data-header]");
    if (!header) return;
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initScrollProgress() {
    const progress = document.querySelector("[data-scroll-progress]");
    if (!progress) return;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.style.width = `${ratio * 100}%`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function markActiveNavigation() {
    const current = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      const target = href.split("?")[0].split("#")[0] || "index.html";
      const hash = href.includes("#") ? `#${href.split("#")[1]}` : "";
      const isActive = target === current && (!hash || hash === window.location.hash);
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
    });
  }

  function initMotion() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      document.querySelectorAll(".reveal, .section-head, .search-shell, .contact-panel, .rule-block, .catalog-hero, .object-hero-content").forEach((node) => node.classList.add("is-visible"));
      return;
    }

    initRevealObserver();
    initTextReveal();
    initPinnedGallery();
    initPrincipledMotion();
  }

  function initRevealObserver() {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    refreshRevealTargets();
  }

  function refreshRevealTargets() {
    const targets = document.querySelectorAll(".reveal, .section-head, .search-shell, .contact-panel, .rule-block, .catalog-hero, .object-hero-content");
    if (!revealObserver) {
      targets.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    targets.forEach((node, index) => {
      if (node.classList.contains("is-visible")) return;
      node.style.setProperty("--reveal-delay", `${Math.min(index % 8, 7) * 55}ms`);
      node.style.setProperty("--motion-index", `${index % 12}`);
      node.classList.add("motion-stage-target");
      revealObserver.observe(node);
    });
  }

  function initTextReveal() {
    document.querySelectorAll("[data-split]").forEach((node) => {
      const text = node.textContent.trim();
      const words = text.split(/(\s+)/);
      node.innerHTML = words.map((part) => {
        if (/\s+/.test(part)) return part;
        return `<span>${part}</span>`;
      }).join("");
    });

    const update = () => {
      document.querySelectorAll("[data-split]").forEach((node) => {
        const rect = node.getBoundingClientRect();
        const start = window.innerHeight * 0.84;
        const end = window.innerHeight * 0.28;
        const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)));
        const spans = [...node.querySelectorAll("span")];
        const visibleCount = Math.ceil(spans.length * progress);
        spans.forEach((span, index) => span.classList.toggle("is-visible", index < visibleCount));
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initPinnedGallery() {
    const section = document.querySelector(".pinned-showcase");
    const gallery = document.querySelector("[data-pin-gallery]");
    if (!section || !gallery) return;
    const images = [...gallery.querySelectorAll("img")];
    if (!images.length) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const distance = rect.height - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, -rect.top / distance)) : 0;
      const activeIndex = Math.min(images.length - 1, Math.floor(progress * images.length));
      images.forEach((img, index) => {
        const active = index === activeIndex;
        img.classList.toggle("is-active", active);
        img.style.opacity = active ? "1" : "0";
        img.style.transform = active ? `scale(${1 + progress * 0.025})` : "scale(1.06)";
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function initPrincipledMotion() {
    document.body.classList.add("has-principled-motion");

    const pressTargets = ".btn, .favorite-btn, .fav-link, .menu-toggle, .map-marker-item, .object-card, .lot-card, .nkr-plan-card, .nkr-tech-card, .nkr-glass-card, .filter-chip, .active-chip, .area-pill";

    document.addEventListener("pointerdown", (event) => {
      const target = event.target.closest(pressTargets);
      if (!target) return;
      target.classList.remove("motion-press");
      void target.offsetWidth;
      target.classList.add("motion-press");
    }, { passive: true });

    document.addEventListener("animationend", (event) => {
      if (event.animationName === "abPressSquash" || event.animationName === "abFavoriteBeat") {
        event.target.classList.remove("motion-press", "motion-heartbeat");
      }
    });

    document.addEventListener("click", (event) => {
      const favorite = event.target.closest(".favorite-btn, .fav-link");
      if (!favorite) return;
      favorite.classList.remove("motion-heartbeat");
      void favorite.offsetWidth;
      favorite.classList.add("motion-heartbeat");
    });

    const stageGroups = document.querySelectorAll(".hero-proof, .object-grid, .feature-grid, .lot-grid, .facts-grid, .nkr-levels, .nkr-tech-cards, .nkr-plan-grid, .nkr-offers-grid, .map-object-list, .timeline, .nkr-roadmap, .nkr-commercial-grid");
    stageGroups.forEach((group) => {
      [...group.children].forEach((child, index) => {
        child.style.setProperty("--motion-index", `${index}`);
        child.classList.add("motion-pose-child");
      });
    });

    const animatedVisuals = document.querySelectorAll(".hero-media, .hero-image, .map-viewport, .pin-stage, .drawer-image, .object-media, .lot-media, .nkr-tech-visual, .nkr-map-card");
    animatedVisuals.forEach((node, index) => {
      node.style.setProperty("--motion-index", `${index % 8}`);
      node.classList.add("motion-follow-layer");
    });
  }

  function initPageTransitions() {
    document.addEventListener("click", (event) => {
      const link = event.target.closest("a[href]");
      if (!link || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("http") || link.target === "_blank") return;
      if (href.includes("#") && href.split("#")[0] === window.location.pathname.split("/").pop()) return;
      event.preventDefault();
      document.body.classList.add("is-leaving");
      window.setTimeout(() => { window.location.href = href; }, 180);
    });
  }

  function initMitinoCarousel() {
    var root = document.getElementById("mc-root");
    var track = document.getElementById("mc-track");
    if (!root || !track) return;

    var REAL = 10;
    var VISIBLE = 3; // images shown at once
    // items[0]=lastClone, items[1..10]=real, items[11..13]=firstClones
    var items = Array.from(track.querySelectorAll(".mc-item"));
    var dots = Array.from(document.querySelectorAll("#mc-dots .mc-dot"));
    var counter = document.getElementById("mc-count");
    var progress = document.getElementById("mc-progress");
    var prevBtn = document.getElementById("mc-prev");
    var nextBtn = document.getElementById("mc-next");

    var current = 1;
    var isTransitioning = false;
    var isDragging = false;
    var didDrag = false;
    var dragStartX = 0;
    var dragDelta = 0;
    var autoTimer = null;
    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function pad(n) { return String(n).padStart(2, "0"); }

    function getVisible() { return root.offsetWidth < 760 ? 1 : VISIBLE; }
    function getGap() { return root.offsetWidth < 760 ? 0 : 12; }
    function getItemW() { var v = getVisible(), g = getGap(); return (root.offsetWidth - (v - 1) * g) / v; }
    function getStep() { return getItemW() + getGap(); }

    function realIndex(c) {
      return ((c - 1) % REAL + REAL) % REAL;
    }

    function updateHUD(c) {
      var ri = realIndex(c);
      if (counter) counter.textContent = pad(ri + 1) + " ∕ " + pad(REAL);
      dots.forEach(function(dot, i) { dot.classList.toggle("is-active", i === ri); });
    }

    function goTo(c, animated) {
      track.classList.toggle("no-transition", animated === false);
      if (animated !== false) isTransitioning = true;
      current = c;
      track.style.transform = "translateX(" + (-c * getStep()) + "px)";
      updateHUD(c);
    }

    window.addEventListener("resize", function() { goTo(current, false); });

    track.addEventListener("transitionend", function(e) {
      if (e.propertyName !== "transform") return;
      isTransitioning = false;
      // Infinite loop: silently jump from clone to real item
      if (current === 0) {
        goTo(REAL, false);
      } else if (current === REAL + 1) {
        goTo(1, false);
      }
      // Retrigger Ken Burns on newly active item after silent jump
      items.forEach(function(item, i) { item.classList.toggle("is-active", i === current); });
    });

    function next() {
      if (isTransitioning) return;
      goTo(current + 1, true);
      resetProgress();
    }
    function prev() {
      if (isTransitioning) return;
      goTo(current - 1, true);
      resetProgress();
    }

    if (prevBtn) prevBtn.addEventListener("click", function() { stopAuto(); prev(); startAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", function() { stopAuto(); next(); startAuto(); });

    dots.forEach(function(dot, i) {
      dot.addEventListener("click", function() {
        if (isTransitioning) return;
        stopAuto();
        goTo(i + 1, true);
        resetProgress();
        startAuto();
      });
    });

    // Drag / swipe
    function getX(e) { return e.touches ? e.touches[0].clientX : e.clientX; }

    root.addEventListener("mousedown", function(e) {
      if (e.button !== 0) return;
      isDragging = true;
      didDrag = false;
      dragStartX = getX(e);
      dragDelta = 0;
      stopAuto();
      root.classList.add("is-dragging");
    });
    window.addEventListener("mousemove", function(e) {
      if (!isDragging) return;
      dragDelta = getX(e) - dragStartX;
      if (Math.abs(dragDelta) > 5) didDrag = true;
    });
    window.addEventListener("mouseup", function() {
      if (!isDragging) return;
      isDragging = false;
      root.classList.remove("is-dragging");
      if (Math.abs(dragDelta) > getStep() * 0.2) { dragDelta < 0 ? next() : prev(); }
      startAuto();
    });

    root.addEventListener("touchstart", function(e) {
      isDragging = true;
      didDrag = false;
      dragStartX = e.touches[0].clientX;
      dragDelta = 0;
      stopAuto();
    }, { passive: true });
    root.addEventListener("touchmove", function(e) {
      if (!isDragging) return;
      dragDelta = e.touches[0].clientX - dragStartX;
      if (Math.abs(dragDelta) > 5) didDrag = true;
    }, { passive: true });
    root.addEventListener("touchend", function() {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(dragDelta) > getStep() * 0.15) { dragDelta < 0 ? next() : prev(); }
      startAuto();
    });

    // Pause auto on hover
    root.addEventListener("mouseenter", stopAuto);
    root.addEventListener("mouseleave", startAuto);

    // Auto-advance every 5s
    function startAuto() {
      if (prefersReduced) return;
      stopAuto();
      autoTimer = setInterval(next, 5000);
      resetProgress();
    }
    function stopAuto() {
      clearInterval(autoTimer);
      autoTimer = null;
      if (progress) { progress.style.transition = "none"; progress.style.width = "0%"; }
    }
    function resetProgress() {
      if (!progress || prefersReduced) return;
      progress.style.transition = "none";
      progress.style.width = "0%";
      requestAnimationFrame(function() {
        requestAnimationFrame(function() {
          progress.style.transition = "width 5s linear";
          progress.style.width = "100%";
        });
      });
    }

    // Click → modal
    items.forEach(function(item) {
      item.addEventListener("click", function() {
        if (didDrag) return;
        openModal(Number(item.dataset.ci || 0));
      });
    });

    // Init
    goTo(1, false);
    startAuto();

    // ── Modal ──────────────────────────────────────────────
    var modal = document.createElement("div");
    modal.className = "mc-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-label", "Просмотр фотографии");
    modal.innerHTML = [
      '<img class="mc-modal-img" src="" alt="">',
      '<button class="mc-modal-close" aria-label="Закрыть">&#10005;</button>',
      '<button class="mc-modal-nav mc-modal-nav--prev" aria-label="Предыдущая фотография">',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3L5 8L10 13"/></svg>',
      '</button>',
      '<button class="mc-modal-nav mc-modal-nav--next" aria-label="Следующая фотография">',
      '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3L11 8L6 13"/></svg>',
      '</button>',
      '<p class="mc-modal-footer" id="mc-modal-foot">01 / 10</p>'
    ].join("");
    document.body.appendChild(modal);

    var modalImg = modal.querySelector(".mc-modal-img");
    var modalClose = modal.querySelector(".mc-modal-close");
    var modalNavPrev = modal.querySelector(".mc-modal-nav--prev");
    var modalNavNext = modal.querySelector(".mc-modal-nav--next");
    var modalFoot = modal.querySelector(".mc-modal-footer");
    var modalIdx = 0;

    function showModalSlide() {
      modalImg.src = "assets/Carusel/" + pad(modalIdx + 1) + ".jpg";
      modalImg.alt = "Митино — фото " + (modalIdx + 1);
      if (modalFoot) modalFoot.textContent = pad(modalIdx + 1) + " ∕ " + pad(REAL);
    }
    function openModal(ri) {
      modalIdx = ri;
      showModalSlide();
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      modalClose.focus();
      stopAuto();
    }
    function closeModal() {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      startAuto();
    }

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", function(e) { if (e.target === modal) closeModal(); });
    modalNavPrev.addEventListener("click", function() { modalIdx = (modalIdx - 1 + REAL) % REAL; showModalSlide(); });
    modalNavNext.addEventListener("click", function() { modalIdx = (modalIdx + 1) % REAL; showModalSlide(); });
    document.addEventListener("keydown", function(e) {
      if (!modal.classList.contains("is-open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") { modalIdx = (modalIdx - 1 + REAL) % REAL; showModalSlide(); }
      if (e.key === "ArrowRight") { modalIdx = (modalIdx + 1) % REAL; showModalSlide(); }
    });
  }

  function normalize(value) {
    return String(value || "").toLowerCase().replace("ё", "е").trim();
  }

  function formatArea(area) {
    return `${Number(area).toLocaleString("ru-RU", { maximumFractionDigits: 2 })} м²`;
  }

  function statusLabel(status) {
    return status === "available" ? "Доступно" : status;
  }

  function filterName(key) {
    return { q: "Поиск", deal: "Сделка", object: "Объект", type: "Формат", areaMin: "Площадь от", areaMax: "Площадь до", priceMin: filters.deal === "buy" ? "Цена от" : "Ставка от", priceMax: filters.deal === "buy" ? "Цена до" : "Ставка до", floor: "Этаж", wholeOnly: "Здание целиком", favorites: "Избранное" }[key] || key;
  }

  function filterLabel(key, value) {
    if (key === "deal") return value === "rent" ? "Аренда" : "Покупка";
    if (key === "object") return value.split(",").map((id) => objectById[id]?.shortTitle || id).join(", ");
    if (key === "type") return formats.find(([id]) => id === value)?.[1] || value;
    if (key === "status") return statusLabel(value);
    if (key === "purpose") return purposes.find(([id]) => id === value)?.[1] || value;
    return value;
  }
})();
