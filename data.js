window.ABCENTRUM = {
  contacts: {
    name: "Сергей Жаров",
    phone: "+7 (958) 500-48-30",
    phoneHref: "tel:+79585004830",
    grekovaPhone: "+7 (925) 505-97-72",
    grekovaPhoneHref: "tel:+79255059772",
    email: "s.zharov@abcentrum.ru",
    emailHref: "mailto:s.zharov@abcentrum.ru",
    telegram: "@ABCENTRUM_DEV",
    telegramHref: "https://t.me/abcentrum_dev",
    formEndpoint: ""
  },
  objects: [
    {
      id: "mitino",
      title: "Промтехнопарк «Митино»",
      shortTitle: "Промтехнопарк «Митино»",
      status: "available",
      deals: ["rent"],
      image: "assets/object-mitino.jpg",
      page: "mitino.html",
      address: "Москва, Барышиха 37А",
      areaLabel: "11 776,20 м²",
      stageLabel: "Финальная стадия",
      keyDateLabel: "Ввод III кв. 2026",
      description: "Бутик-промтехнопарк класса A+ в Митино для light industrial, офиса, showroom, общепита и смешанных бизнес-сценариев. Доступен только в аренду: 7 физических лотов и сценарий объединения в единый контур.",
      metrics: [
        "Общая площадь: 11 776,20 м²",
        "Сделка: только аренда",
        "Лоты: 7 физических лотов",
        "Сценарий: объединение до 5 106,23 м²",
        "Электроэнергия: 1,5 МВт",
        "Парковка: 70 м/м",
        "Стадия: финальная",
        "Ключевая дата: ввод III кв. 2026"
      ]
    },
    {
      id: "nekrasovka",
      title: "Промтехнопарк «Некрасовка»",
      shortTitle: "Промтехнопарк «Некрасовка»",
      status: "available",
      deals: ["rent", "buy"],
      image: "assets/object-nekrasovka.jpg",
      page: "nekrasovka.html",
      address: "Москва, район Некрасовка, пересечение проектируемых проездов 83 и 4296",
      areaLabel: "5 507 м²",
      stageLabel: "Проектируется",
      keyDateLabel: "РНС июнь 2026 · ввод IV кв. 2027",
      description: "Промышленный парк ABCENTRUM для производства, light industrial, административной и сервисной функции. Доступна аренда здания целиком или отдельных уровней, а также покупка здания целиком.",
      metrics: [
        "Общая площадь здания: 5 507 м²",
        "Арендопригодная площадь: 5 188,73 м²",
        "Земельный участок: 6 688 м²",
        "Электрическая мощность: 800 кВт",
        "Стадия: проектируется",
        "РНС: июнь 2026",
        "Ввод: IV кв. 2027",
        "Уровни: 2 надземных + 1 подземно-технический",
        "Парковка: 20 м/м, включая 3 места с зарядкой"
      ]
    },
    {
      id: "grekova",
      title: "Медицинский центр «Грекова»",
      shortTitle: "Медицинский центр «Грекова»",
      status: "available",
      deals: ["rent", "buy"],
      image: "assets/object-grekova.png",
      page: "grekova.html",
      address: "Москва, ул. Грекова, 5–7",
      areaLabel: "3 695,89 м²",
      stageLabel: "РНС IV кв. 2027",
      keyDateLabel: "Метро «Медведково» 290 м",
      description: "Отдельно стоящее здание медицинского назначения в Северном Медведково. Доступна аренда здания целиком и блоками, покупка — только здания целиком.",
      metrics: [
        "Общая площадь по ТЭП: 3 695,89 м²",
        "Наземная нежилая площадь: 2 765,01 м²",
        "Подземная нежилая площадь: 930,88 м²",
        "Арендуемые помещения: 2 619,78 м²",
        "МОП: 894,80 м²",
        "Площадь застройки: 1 062,45 м²",
        "Метро «Медведково»: 290 м"
      ]
    }
  ],
  lots: [
    { id: "B37A-01", building: "mitino", deal: "rent", type: "Showroom / клиентский блок", subType: "помещение под showroom, 1 этаж", category: "showroom", area: 425.30, floor: "1", ceiling: "4 м", rate: "29 000 руб./м²/год", condition: "Shell & Core", purpose: "showroom / клиентский блок / фирменное представительство", status: "available", plan: "layout-b37a-01-showroom-425.png", sortRate: 29000, commercialTerms: ["аренда", "Shell & Core", "ставка 29 000 руб./м²/год"], highlights: ["showroom", "клиентский доступ", "1 этаж", "потолки 4 м"] },
    { id: "B37A-02", building: "mitino", deal: "rent", type: "Кафе / ресторан", subType: "помещение под общепит, 1 этаж", category: "food", area: 385.12, floor: "1", ceiling: "4 м", rate: "29 000 руб./м²/год", condition: "Shell & Core", purpose: "общепит / кафе / ресторан / корпоративное питание", status: "available", plan: "layout-b37a-02-food-385.png", sortRate: 29000, commercialTerms: ["аренда", "Shell & Core", "ставка 29 000 руб./м²/год"], highlights: ["общепит", "потенциал трафика", "1 этаж", "потолки 4 м"] },
    { id: "B37A-03", building: "mitino", deal: "rent", type: "Производственный блок", subType: "производственная площадь + зона погрузки", category: "industrial", area: 3067.05, floor: "3 + 1", ceiling: "8 м", rate: "18 000 руб./м²/год", condition: "Shell & Core", purpose: "производство / light industrial / зона погрузки-разгрузки", status: "available", plan: "layout-b37a-03-production-3067.png", sortRate: 18000, commercialTerms: ["аренда", "Shell & Core", "ставка 18 000 руб./м²/год"], highlights: ["light industrial", "производственная площадь", "зона погрузки-разгрузки", "потолки 8 м"] },
    { id: "B37A-04", building: "mitino", deal: "rent", type: "Офисный блок", subType: "офисное помещение, 3 этаж", category: "office", area: 896.94, floor: "3", ceiling: "4 м", rate: "28 000 руб./м²/год", condition: "Shell & Core", purpose: "офис / штаб-квартира / back-office", status: "available", plan: "layout-b37a-04-office-897.png", sortRate: 28000, commercialTerms: ["аренда", "Shell & Core", "ставка 28 000 руб./м²/год"], highlights: ["офисный блок", "штаб-квартира", "back-office", "3 этаж"] },
    { id: "B37A-05", building: "mitino", deal: "rent", type: "Мезонинный блок", subType: "мезонин левый, 4 этаж", category: "mezzanine", area: 394.16, floor: "4", ceiling: "4 м", rate: "18 000 руб./м²/год", condition: "Shell & Core", purpose: "производство / склад / мезонин", status: "available", plan: "layout-b37a-05-mezzanine-394.png", sortRate: 18000, commercialTerms: ["аренда", "Shell & Core", "ставка 18 000 руб./м²/год"], highlights: ["мезонин", "производство", "складская функция", "4 этаж"] },
    { id: "B37A-06", building: "mitino", deal: "rent", type: "Мезонинный блок", subType: "мезонин правый, 4 этаж", category: "mezzanine", area: 319.29, floor: "4", ceiling: "4 м", rate: "18 000 руб./м²/год", condition: "Shell & Core", purpose: "производство / склад / мезонин", status: "available", plan: "layout-b37a-06-mezzanine-319.png", sortRate: 18000, commercialTerms: ["аренда", "Shell & Core", "ставка 18 000 руб./м²/год"], highlights: ["мезонин", "производство", "складская функция", "компактный блок"] },
    { id: "B37A-07", building: "mitino", deal: "rent", type: "Офисный блок", subType: "офисное помещение, 4 этаж", category: "office", area: 429.79, floor: "4", ceiling: "4 м", rate: "28 000 руб./м²/год", condition: "Shell & Core", purpose: "офис / команда проекта / клиентский офис", status: "available", plan: "layout-b37a-07-office-430.png", sortRate: 28000, commercialTerms: ["аренда", "Shell & Core", "ставка 28 000 руб./м²/год"], highlights: ["офис", "команда проекта", "клиентский офис", "4 этаж"] },
    { id: "NKR-ALL-R", building: "nekrasovka", deal: "rent", type: "Здание целиком", subType: "промышленный парк целиком, 2 надземных уровня + подземно-технический уровень", category: "industrial", area: 5507, floor: "-1 + 1 + антресоль + 2", ceiling: "8,0 / 6,2 / 4,0 м", rate: "15 500 ₽/м²/год", condition: "Проектируется · РНС июнь 2026", purpose: "производство / light industrial / административная и сервисная функция", status: "available", plan: "layout-nekrasovka-whole.svg", sortRate: 15500, commercialTerms: ["аренда здания целиком: 5–7 лет", "OPEX: 3 000 ₽/м²/год", "НДС: 22% сверху", "коммунальные по факту", "pre-lease скидка 5–7%", "fit-out 2–6 месяцев"], highlights: ["здание целиком", "light industrial", "800 кВт", "ввод IV кв. 2027"] },
    { id: "NKR-01", building: "nekrasovka", deal: "rent", type: "Производственный этаж", subType: "1 этаж промышленного парка Некрасовка", category: "industrial", area: 2509.78, floor: "1", ceiling: "8,0 м", rate: "18 000 ₽/м²/год", condition: "Проектируется · РНС июнь 2026", purpose: "производство / light industrial / погрузка и сервис", status: "available", plan: "layout-nekrasovka-floor-1.svg", sortRate: 18000, commercialTerms: ["поэтажная аренда: 3–5 лет", "OPEX: 3 000 ₽/м²/год", "НДС: 22% сверху", "коммунальные по факту", "pre-lease скидка 5–7%", "fit-out 2–6 месяцев"], highlights: ["1 этаж", "потолки 8 м", "производство", "погрузка и сервис"] },
    { id: "NKR-MZ", building: "nekrasovka", deal: "rent", type: "Антресоль", subType: "антресоль промышленного парка Некрасовка", category: "mezzanine", area: 196.65, floor: "антресоль", ceiling: "4,0 м", rate: "16 000 ₽/м²/год", condition: "Проектируется · РНС июнь 2026", purpose: "вспомогательная функция / сервис / хранение", status: "available", plan: "layout-nekrasovka-mezzanine.svg", sortRate: 16000, commercialTerms: ["поэтажная аренда: 3–5 лет", "OPEX: 3 000 ₽/м²/год", "НДС: 22% сверху", "коммунальные по факту", "fit-out 2–6 месяцев"], highlights: ["антресоль", "сервисная функция", "хранение", "компактный блок"] },
    { id: "NKR-02", building: "nekrasovka", deal: "rent", type: "Производственный этаж", subType: "2 этаж промышленного парка Некрасовка", category: "industrial", area: 2571.35, floor: "2", ceiling: "6,2 м", rate: "15 000 ₽/м²/год", condition: "Проектируется · РНС июнь 2026", purpose: "производство / light industrial / административная функция", status: "available", plan: "layout-nekrasovka-floor-2.svg", sortRate: 15000, commercialTerms: ["поэтажная аренда: 3–5 лет", "OPEX: 3 000 ₽/м²/год", "НДС: 22% сверху", "коммунальные по факту", "pre-lease скидка 5–7%", "fit-out 2–6 месяцев"], highlights: ["2 этаж", "производство", "административная функция", "потолки 6,2 м"] },
    { id: "NKR-SALE-01", building: "nekrasovka", deal: "buy", type: "Здание целиком", subType: "продажа промышленного парка в Некрасовке целиком", category: "industrial", area: 5507, floor: "-1 + 1 + антресоль + 2", ceiling: "8,0 / 6,2 / 4,0 м", rate: "200 000 ₽/м²", condition: "ПДКП / ДКПБВ · ввод IV кв. 2027", purpose: "покупка здания целиком / инвестиционный сценарий / собственное производство", status: "available", plan: "layout-nekrasovka-sale.svg", sortPrice: 200000, commercialTerms: ["продажа только зданием целиком", "цена продажи: 200 000 ₽/м² без НДС", "сумма продажи: 1 101 400 000 ₽ без НДС", "сценарий оплаты: 5% по ПДКП", "после РНС ДКПБВ и 30%", "далее 4 платежа × 16,25%"], highlights: ["покупка только целиком", "промышленный парк", "инвестиционный сценарий", "1 101 400 000 ₽ без НДС"] },
    { id: "GRK-ALL-R", building: "grekova", deal: "rent", type: "Медицинский центр целиком", subType: "отдельно стоящее здание медицинского назначения целиком", category: "medical", area: 3695.89, floor: "-1 + 1 + 2 + 3", ceiling: "12,0 м высота здания", rate: "26 000 ₽/м²/год", condition: "Shell & Core · РНС IV кв. 2027", purpose: "медицинский оператор / клиника / реабилитационный центр / доходный арендный актив", status: "available", plan: "", sortRate: 26000, commercialTerms: ["аренда здания целиком", "общая площадь по ТЭП: 3 695,89 м²", "арендуемые помещения: 2 619,78 м²", "OPEX: 5 000 ₽/м²/год", "индексация: 7% со второго года", "состояние передачи: Shell & Core", "РНС IV кв. 2027"], highlights: ["медицинский центр целиком", "отдельно стоящее здание", "метро 290 м", "3 695,89 м²"] },
    { id: "GRK-B1", building: "grekova", deal: "rent", type: "Сервисный уровень", subType: "-1 этаж · арендуемые помещения сервисного уровня", category: "service", area: 500.38, floor: "-1", ceiling: "12,0 м высота здания", rate: "18 000 ₽/м²/год", condition: "Shell & Core · РНС IV кв. 2027", purpose: "технический и сервисный уровень / гибкие площади под медицинские функции", status: "available", plan: "grekova-plan-basement.webp", sortRate: 18000, commercialTerms: ["арендуемые помещения: 500,38 м²", "технические помещения: 103,71 м²", "МОП: 296,84 м²", "OPEX: 5 000 ₽/м²/год", "индексация: 7% со второго года", "состояние передачи: Shell & Core", "РНС IV кв. 2027"], highlights: ["сервисный уровень", "арендуемые помещения 500,38 м²", "медицинская инфраструктура", "-1 этаж"] },
    { id: "GRK-01", building: "grekova", deal: "rent", type: "Стрит-ритейл / входная группа", subType: "1 этаж · амбулаторно-консультационный блок", category: "retail", area: 703.38, floor: "1", ceiling: "12,0 м высота здания", rate: "60 000 ₽/м²/год", condition: "Shell & Core · РНС IV кв. 2027", purpose: "входная группа / амбулаторно-консультационный блок / первая линия", status: "available", plan: "grekova-plan-floor-1.webp", sortRate: 60000, commercialTerms: ["арендуемые помещения: 703,38 м²", "МОП: 202,38 м²", "OPEX: 5 000 ₽/м²/год", "индексация: 7% со второго года", "состояние передачи: Shell & Core", "РНС IV кв. 2027"], highlights: ["первая линия", "входная группа", "арендуемые помещения 703,38 м²", "1 этаж"] },
    { id: "GRK-02", building: "grekova", deal: "rent", type: "Медицинский блок", subType: "2 этаж · ЛФК и восстановительные программы", category: "medical", area: 708.01, floor: "2", ceiling: "12,0 м высота здания", rate: "36 000 ₽/м²/год", condition: "Shell & Core · РНС IV кв. 2027", purpose: "ЛФК / восстановительные программы / пространства для реабилитации", status: "available", plan: "grekova-plan-floor-2.webp", sortRate: 36000, commercialTerms: ["арендуемые помещения: 708,01 м²", "МОП: 197,79 м²", "OPEX: 5 000 ₽/м²/год", "индексация: 7% со второго года", "состояние передачи: Shell & Core", "РНС IV кв. 2027"], highlights: ["медицинский блок", "ЛФК", "арендуемые помещения 708,01 м²", "2 этаж"] },
    { id: "GRK-03", building: "grekova", deal: "rent", type: "Медицинский блок", subType: "3 этаж · индивидуальные занятия и специализированные услуги", category: "medical", area: 708.01, floor: "3", ceiling: "12,0 м высота здания", rate: "36 000 ₽/м²/год", condition: "Shell & Core · РНС IV кв. 2027", purpose: "индивидуальные занятия / специализированные медицинские услуги", status: "available", plan: "grekova-plan-floor-3.webp", sortRate: 36000, commercialTerms: ["арендуемые помещения: 708,01 м²", "МОП: 197,79 м²", "OPEX: 5 000 ₽/м²/год", "индексация: 7% со второго года", "состояние передачи: Shell & Core", "РНС IV кв. 2027"], highlights: ["медицинский блок", "специализированные услуги", "арендуемые помещения 708,01 м²", "3 этаж"] },
    { id: "GRK-SALE-01", building: "grekova", deal: "buy", type: "Здание целиком", subType: "продажа отдельно стоящего здания медицинского назначения целиком", category: "medical", area: 3695.89, floor: "-1 + 1 + 2 + 3", ceiling: "12,0 м высота здания", rate: "300 000 ₽/м²", condition: "Продажа целиком · РНС IV кв. 2027", purpose: "покупка медицинского здания целиком / медицинский оператор / инвестиционный арендный актив", status: "available", plan: "", sortPrice: 300000, commercialTerms: ["продажа только объекта целиком", "цена продажи: 300 000 ₽/м²", "общая площадь по ТЭП: 3 695,89 м²", "ориентир стоимости покупки: 1,11 млрд ₽", "потенциальный валовый поток по поэтажной аренде: 102,2 млн ₽/год", "валовая доходность: ≈9,2%", "OPEX: 5 000 ₽/м²/год", "индексация: 7% со второго года", "состояние передачи: Shell & Core"], highlights: ["покупка только целиком", "медицинский объект", "инвестиционный арендный актив", "ориентир 1,11 млрд ₽"] }
  ],
  formats: [
    { id: "industrial", label: "Light industrial" },
    { id: "mezzanine", label: "Мезонин" },
    { id: "office", label: "Офисы" },
    { id: "showroom", label: "Showroom" },
    { id: "food", label: "Общепит" },
    { id: "medical", label: "Медицинский центр" },
    { id: "retail", label: "Street retail" },
    { id: "service", label: "Сервис" }
  ]
};
