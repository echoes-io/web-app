# 🗺️ Echoes Web App - Roadmap

## 🎨 **FASE 1: Theming System** (PRIORITÀ MASSIMA)

### 1.1 Sistema Temi Multi-Timeline ✅ COMPLETATO
- [x] **Theme Provider con context**
  - Provider React per gestire tema corrente
  - Supporto SSR (Next.js App Router)
  - Persistenza preferenza utente (localStorage + cookie)

- [x] **4 Temi con Light/Dark Mode** (8 varianti totali)
  - `neutral` (light/dark) - pagine generiche, homepage, about
  - `anima` (light/dark) - timeline Anima (sage green)
  - `eros` (light/dark) - timeline Eros (burgundy)
  - `bloom` (light/dark) - timeline Bloom (terracotta peach)

- [x] **Integrazione Tailwind CSS**
  - Esteso Tailwind v4 con palette @echoes-io/brand
  - CSS variables dinamiche per tema attivo (`--theme-*`)
  - Utility classes per ogni timeline (`bg-anima-500`, `text-eros-700`, etc.)

- [x] **Dark Mode Toggle**
  - Componente toggle light/dark
  - Rispetta preferenza sistema (prefers-color-scheme)
  - Salvataggio in cookie (SSR) + localStorage

- [x] **Theme Debugger Component** 🐛
  - Pannello dev per testare tutti i temi
  - Switcher rapido tra timeline themes
  - Toggle light/dark immediato
  - Preview colori live
  - Solo in development mode

- [x] **Auto-theme da Route**
  - Hook `useRouteTheme()` per detection automatica
  - `/anima/*` → tema anima
  - `/eros/*` → tema eros
  - `/bloom/*` → tema bloom
  - Fallback a neutral

### 1.2 Componenti UI Themed ✅ COMPLETATO
- [x] Adattare shadcn/ui components ai temi
  - Button: variants `neutral`, `anima`, `eros`, `bloom` + outline variants
  - Card: variants themed con background e border colors
  - Badge: variants solid + outline per ogni timeline
  - Alert: variants themed per ogni timeline
- [x] ThemeDebugger con tab Preview
  - Preview live di tutti i componenti themed
  - Test rapido di tutte le varianti
- [x] Documentazione variants inline nei componenti

---

## 📄 **FASE 2: Content Structure & Pages**

### 2.1 Homepage & Layout ✅ COMPLETATO
- [x] Homepage neutra con intro Echoes
  - Hero section con descrizione
  - Timeline cards con themed variants
  - About section
- [x] Navigation principale con link timelines
  - Sticky header con logo
  - Timeline links (Anima, Eros, Bloom)
  - Dark mode toggle integrato
- [x] Footer con credits e links
  - About, Timelines, Resources sections
  - Copyright notice
- [x] Layout responsive (mobile-first)
  - Grid responsive per timeline cards
  - Mobile navigation

### 2.2 Timeline Pages
- [ ] `/[timeline]` - Overview timeline con arcs
- [ ] `/[timeline]/[arc]` - Arc page con episodes
- [ ] `/[timeline]/[arc]/[episode]` - Episode page con chapters
- [ ] `/[timeline]/[arc]/[episode]/[chapter]` - Chapter reader

### 2.3 Chapter Reader
- [ ] Layout ottimizzato per lettura
- [ ] Typography responsive (font size, line height)
- [ ] Navigation prev/next chapter
- [ ] Progress indicator
- [ ] Metadata display (POV, location, date, outfit, kink)
- [ ] Reading time estimate

---

## 🗄️ **FASE 3: Database & Content Sync**

### 3.1 Seed Database
- [ ] Popolare timelines, arcs, episodes
- [ ] Script seed da struttura content esistente
- [ ] Validazione dati

### 3.2 Content Sync System
- [ ] GitHub Action per sync automatico
- [ ] API route `/api/content/sync`
- [ ] Parse frontmatter + markdown
- [ ] Upsert chapters nel database
- [ ] Webhook trigger on push

### 3.3 Content API
- [ ] `/api/timelines` - lista timelines
- [ ] `/api/timelines/[timeline]` - dettaglio timeline
- [ ] `/api/chapters/[id]` - singolo chapter
- [ ] Caching strategy (ISR)

---

## 🎯 **FASE 4: Features Avanzate**

### 4.1 Search & Discovery
- [ ] Search bar globale
- [ ] Filtri per timeline, POV, tags
- [ ] Risultati con highlight

### 4.2 Reading Experience
- [ ] Bookmark chapters (localStorage)
- [ ] Reading history
- [ ] Font size controls
- [ ] Sepia mode per lettura

### 4.3 Timeline Visualization
- [ ] Timeline interattiva (grafico)
- [ ] Visualizzazione arcs/episodes
- [ ] Filtro per POV

---

## 🚀 **FASE 5: Performance & SEO**

### 5.1 Ottimizzazioni
- [ ] Image optimization (next/image)
- [ ] Font optimization (next/font)
- [ ] Code splitting
- [ ] Lazy loading componenti

### 5.2 SEO
- [ ] Metadata dinamici per ogni pagina
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] robots.txt

### 5.3 Analytics
- [ ] Vercel Analytics
- [ ] Reading metrics
- [ ] Popular chapters

---

## 🧪 **FASE 6: Testing & Quality**

### 6.1 Unit Tests
- [ ] Componenti UI
- [ ] Utilities e helpers
- [ ] Theme provider logic

### 6.2 E2E Tests
- [ ] User flows principali
- [ ] Navigation tra chapters
- [ ] Theme switching

### 6.3 Accessibility
- [ ] WCAG AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader testing

---

## 🎯 Current Sprint

**Focus:** Fase 3.1 - Seed Database

**Completato:**
- ✅ Fase 1.1 - Theme System base
- ✅ Fase 1.2 - Componenti UI Themed
- ✅ Fase 2.1 - Homepage & Layout

**Next Steps:**
1. Fase 3.1 - Seed Database (popolare timelines, arcs, episodes)
2. Fase 2.2 - Timeline Pages (overview, arc, episode, chapter)
3. Fase 2.3 - Chapter Reader

---

## 📝 Notes

### Color Palettes (da @echoes-io/brand)
- **Neutral**: GitHub-inspired grays (50-950)
- **Anima**: Sage green/teal - growth, support, tenderness
- **Eros**: Burgundy/crimson - passion, intensity, rawness
- **Bloom**: Terracotta peach - blossoming, balance, discovery

### Database Schema
- Timeline → Arc → Episode → Chapter
- Part è opzionale (nullable `partNumber` in Chapter)
- Composite PKs su tutta la gerarchia
