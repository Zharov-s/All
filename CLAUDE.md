# CLAUDE.md — Creative Website Redesign & Motion Setup

> Назначение файла: положи этот файл в корень проекта. Claude Code должен прочитать его как проектную инструкцию и выполнить полный аудит, настройку зависимостей, редизайн сайта, анимации, креативный скролл, переходы, UI-элементы и финальную проверку качества.
>
> Рекомендуемый запуск из корня проекта:
>
> ```bash
> claude "Прочитай CLAUDE.md и выполни полный редизайн сайта по разделу 'Mission'. Сначала сделай аудит проекта, затем реализуй изменения, запусти проверки и дай финальный отчет."
> ```

---

## Mission

Ты — senior product designer, creative front-end engineer и motion designer. Твоя задача — превратить текущий сайт в современный, дорогой, визуально выразительный и технически аккуратный продуктовый сайт.

Нужно не просто «добавить анимации», а собрать целостный визуальный опыт:

- премиальный UI без ощущения шаблона;
- плавные page/section transitions;
- продуманные micro-interactions;
- креативный, но доступный scroll experience;
- адаптивный дизайн для mobile/tablet/desktop;
- чистая структура компонентов;
- сохранение существующей бизнес-логики и контента;
- улучшение визуальной иерархии, типографики, spacing, сетки и CTA;
- отсутствие сломанных сборок, ошибок TypeScript, lint/build проблем.

---

## Source Guide Summary

Оригинальная инструкция была про быстрый сайт с помощью Claude Code, Motion/Framer Motion, UI UX Pro Max skill и компонентов 21st.dev. Используй эту идею как направление, но адаптируй под реальный проект.

Ключевые принципы из гайда:

1. Claude Code работает из терминала внутри проекта.
2. Motion/Framer Motion отвечает за плавные анимации.
3. UI-компоненты и паттерны должны давать ощущение профессионального сайта.
4. Все изменения должны остаться в коде проекта, чтобы сайт можно было хостить где угодно.

Важно: не копируй гайд буквально. Проверь текущий стек проекта и ставь только те пакеты, которые реально подходят.

---

## Non-Negotiable Rules

1. Не ломай существующую бизнес-логику, формы, API, маршруты, SEO-метаданные и аналитику.
2. Не удаляй важные компоненты без причины. Если нужно заменить — сначала пойми, где они используются.
3. Не добавляй тяжелые библиотеки ради одного эффекта.
4. Не добавляй секреты, токены, API keys или приватные данные в код.
5. Не делай анимации, которые мешают чтению, навигации или доступности.
6. Всегда учитывай `prefers-reduced-motion`.
7. Все интерактивные элементы должны иметь focus states, aria-атрибуты при необходимости и нормальную keyboard navigation.
8. Финальный результат должен проходить build/typecheck/lint, если такие команды есть в проекте.
9. Если проект уже использует конкретный дизайн-системный подход, развивай его, а не создавай параллельный хаос.
10. В конце дай краткий отчет: что изменено, какие файлы затронуты, какие команды запускались, что осталось проверить вручную.

---

## Step 1 — Audit The Project First

Перед изменениями изучи проект:

- определи стек: Next.js, Vite, React, Astro, Remix, Nuxt, Vue, Svelte или другой;
- определи пакетный менеджер по lock-файлу:
  - `pnpm-lock.yaml` → `pnpm`;
  - `package-lock.json` → `npm`;
  - `yarn.lock` → `yarn`;
  - `bun.lockb` или `bun.lock` → `bun`;
- найди основные страницы, layout, router, global styles, components, assets;
- проверь, используется ли Tailwind, CSS Modules, SCSS, styled-components, shadcn/ui или другая UI-система;
- найди brand colors, typography, theme tokens;
- найди главные UX-проблемы: слабый hero, нет visual rhythm, скучные CTA, плохой mobile, нет состояний hover/focus, резкие переходы, пустые секции, плохой spacing.

После аудита составь короткий план в терминале/ответе и только затем меняй код.

---

## Step 2 — Install / Verify Dependencies

Ставь зависимости только после аудита и только если они нужны.

### Motion

Для нового кода предпочитай современный пакет Motion:

```bash
npm install motion
# или
pnpm add motion
# или
 yarn add motion
# или
bun add motion
```

Импорт для React:

```ts
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
```

Если проект уже использует `framer-motion`, не ломай существующий код. Можно оставить его или аккуратно мигрировать на `motion`, если это не создает лишнего риска.

### Smooth / Creative Scroll

Для креативного плавного скролла можно использовать Lenis:

```bash
npm install lenis
# или pnpm add lenis / yarn add lenis / bun add lenis
```

Используй Lenis только если он уместен для проекта. Не включай агрессивный smooth scroll там, где это ухудшает UX. Обязательно поддержи reduced motion.

### UI Components / Registries

Если проект использует shadcn/ui или его можно безопасно подключить, настрой MCP/registry workflow. Для Claude Code можно создать `.mcp.json`:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

Если используется 21st.dev, добавь их строку интеграции только если она предоставлена пользователем или найдена в проектной документации. Не выдумывай приватные команды интеграции.

### Optional Visual Packages

Добавляй только при реальной пользе:

- `lucide-react` — иконки;
- `class-variance-authority`, `clsx`, `tailwind-merge` — если есть Tailwind/shadcn-подход;
- `gsap` — только если нужен сложный scroll choreography, который Motion не закрывает;
- `three`, `react-three-fiber` — только если сайт реально требует 3D и бюджет производительности позволяет.

---

## Step 3 — Design Direction

Сделай сайт визуально дороже и современнее. Цель — эффект «studio-grade landing/product site», но без хаоса.

### Visual Style

Выбери и внедри согласованное направление:

- чистая сетка, больше воздуха, сильная типографика;
- выразительный hero-screen;
- аккуратные gradients, glows, noise, glass/blur effects — только если подходят бренду;
- карточки с depth, hover states и живой реакцией;
- качественные CTA-блоки;
- секции с контрастным ритмом: hero → proof → benefits → product/features → process → testimonials/cases → CTA;
- визуальные акценты через shapes, lines, orbs, masks, sticky blocks, reveal animations.

### Typography

- Проверь текущие шрифты.
- Улучши scale: display, h1, h2, h3, body, caption.
- Заголовки должны быть короче, сильнее и визуально выразительнее.
- Не используй слишком много разных font weights и sizes.
- На mobile заголовки не должны ломать layout.

### Color & Theme

- Создай или улучши design tokens: background, foreground, muted, accent, border, card, destructive, success.
- Добавь dark/light compatibility, если проект это поддерживает.
- Не делай кислотные цвета без причины.
- CTA должен быть заметным, но не кричащим.

---

## Step 4 — Motion System

Создай единую motion-систему, а не разрозненные случайные эффекты.

### Motion Tokens

Добавь reusable constants/helpers, например:

```ts
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo }
  }
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.08 }
  }
};
```

Адаптируй под стек проекта. Если это Next.js App Router, client-only animation components должны иметь `"use client"`.

### Required Animations

Реализуй минимум:

1. Hero entrance animation:
   - headline split/reveal или fade-up;
   - CTA появление;
   - background/visual element subtle motion.

2. Section reveal on scroll:
   - fade-up/stagger для карточек;
   - viewport once или аккуратное repeated поведение.

3. Navigation interaction:
   - hover/focus states;
   - active state;
   - mobile menu transition, если есть меню.

4. Cards/buttons:
   - hover lift/tilt/glow в рамках вкуса;
   - pressed state;
   - animated icon movement.

5. Page/route transitions:
   - если router позволяет, добавь мягкий transition между страницами;
   - не делай переходы медленнее 300-500ms для навигации.

6. Scroll progress:
   - тонкая progress line/bar или section indicator;
   - не мешает контенту.

### Creative Scroll Ideas

Выбери 2-4 идеи, подходящие проекту:

- sticky story sections;
- parallax background orbs/layers;
- horizontal scroll showcase на desktop с fallback на mobile;
- scroll-driven feature cards;
- timeline/process с progress line;
- image/text reveal masks;
- marquee/logos with reduced-motion fallback;
- pinned CTA block;
- smooth anchor navigation.

Не внедряй всё сразу. Лучше меньше, но качественно.

---

## Step 5 — Component Upgrades

Проверь текущие компоненты и улучши их.

### Must Review

- Header / Navbar
- Hero
- Buttons / CTA
- Feature cards
- Forms
- Testimonials / Reviews
- Pricing / Plans, если есть
- Footer
- Empty states
- Loading states
- Error states

### Add If Missing

Добавь только если уместно:

- `AnimatedSection` wrapper;
- `SmoothScrollProvider`;
- `ScrollProgress`;
- `MagneticButton` или улучшенный CTA;
- `RevealText`;
- `FeatureCard` with hover motion;
- `StickyShowcase`;
- `Marquee` / logo strip;
- `PageTransition`.

Каждый новый компонент должен быть переиспользуемым и понятным.

---

## Step 6 — Implementation Strategy

Работай поэтапно:

1. Создай/обнови дизайн-токены и global styles.
2. Настрой motion helpers.
3. Улучши layout и responsive сетку.
4. Редизайни ключевые страницы сверху вниз.
5. Добавь анимации постепенно.
6. Добавь smooth/creative scroll после базового UI.
7. Проверь mobile.
8. Запусти проверки.
9. Удали мертвый код и неиспользуемые импорты.
10. Подготовь финальный отчет.

Если проект большой, начни с главной страницы и общей дизайн-системы, затем переходи к остальным страницам.

---

## Step 7 — Accessibility & Performance

Обязательно:

- `prefers-reduced-motion` отключает/упрощает анимации;
- анимации не должны блокировать interaction;
- изображения оптимизированы;
- нет layout shift при загрузке;
- хорошая контрастность текста;
- кликабельные элементы минимум 44px на touch;
- keyboard focus видим;
- forms имеют labels/errors/help text;
- navigation accessible;
- декоративные элементы не мешают screen readers;
- lazy-load тяжелых визуальных блоков;
- не добавляй бесконечные анимации на весь экран без необходимости.

---

## Step 8 — Framework-Specific Notes

### Next.js App Router

- Для Motion-компонентов используй `"use client"`.
- Не превращай весь layout в client component без необходимости.
- Анимации выноси в маленькие client wrappers.
- Проверь metadata и server components.
- Используй `next/image`, если проект уже на Next.

### Vite / React

- Подключай Motion напрямую.
- Проверь React Router, если есть route transitions.
- Не добавляй SSR-only паттерны.

### Tailwind

- Расширь theme tokens в `tailwind.config.*`, если уместно.
- Используй utility classes последовательно.
- Не делай огромные нечитаемые className без выделения компонентов.

### CSS Modules / SCSS

- Добавь motion-friendly классы и CSS variables.
- Сохраняй локальность стилей.
- Не смешивай слишком много styling-подходов.

---

## Step 9 — Commands To Run

Определи доступные команды из `package.json`. Обычно нужно выполнить:

```bash
npm run lint
npm run typecheck
npm run build
npm run test
```

Но используй реальный package manager проекта:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

Если команды отсутствуют, не выдумывай. Сообщи, что именно найдено и что удалось запустить.

---

## Step 10 — Final Acceptance Criteria

Работа считается готовой, если:

- сайт визуально выглядит как современный premium/studio-grade проект;
- главный экран сразу стал сильнее;
- есть единая motion-система;
- добавлены плавные и осмысленные transition/reveal/scroll эффекты;
- mobile responsive не сломан;
- нет очевидных accessibility regressions;
- нет ошибок сборки;
- зависимости не раздуты без необходимости;
- код читаемый и поддерживаемый;
- финальный отчет объясняет изменения.

---

## Claude Final Report Template

В конце работы ответь так:

```md
## Redesign Report

### Что сделано
- ...

### Главные визуальные изменения
- ...

### Анимации и скролл
- ...

### Новые/измененные зависимости
- ...

### Измененные файлы
- ...

### Проверки
- [ ] lint
- [ ] typecheck
- [ ] build
- [ ] test

### Что проверить вручную
- ...

### Рекомендации на следующий шаг
- ...
```

---

## One-Shot Task Prompt For Claude Code

Если нужно запустить одним сообщением, используй этот промпт:

```text
Прочитай CLAUDE.md. Выполни аудит проекта, затем сделай полный creative redesign сайта: улучши визуальную систему, layout, typography, CTA, компоненты, адаптивность, добавь Motion-анимации, page/section transitions, креативный scroll experience, micro-interactions и reduced-motion fallback. Установи только нужные зависимости, используй пакетный менеджер проекта, не ломай бизнес-логику, запусти доступные проверки и дай финальный отчет по шаблону из CLAUDE.md.
```

