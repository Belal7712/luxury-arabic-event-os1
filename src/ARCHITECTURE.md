# Arabic Event OS Architecture

## 1. Dashboard UX Architecture
- **Paradigm**: OS-level Windowing. The browser is just a container; the app acts like a native iPad/iPhone experience.
- **Navigation**: Eliminated standard sidebars. Replaced with context-aware floating menus and command palettes (Cmd+K).
- **Core Loop**: Workspace -> Event Overview -> Deep Dives via full-screen bottom sheets instead of new pages.

## 2. Information Architecture
- **Global Layer**: Context Switcher, Universal Search, Notifications.
- **Workspace Layer**: Event Identity (Hero), Pulse (Live Stats), Triggers (Quick Actions).
- **Detail Layer**: Tabs loading contextual content inside a dynamic height container.

## 3. Component Tree
- `App` (State Provider for Overlays)
  - `DashboardShell` (Navigation, Chrome)
    - `WorkspaceHero` (Branding, Global Actions)
    - `LiveStats` (Metrics)
    - `QuickActions` (Shortcuts)
    - `WorkspaceTabs` (Routing alternative)
    - `FAB` (Primary Creation)
  - `BottomSheet` (Contextual edits)
  - `CommandPalette` (Search/Nav)
  - `NotificationCenter` (Alerts)

## 4. Layout Blueprint
- **RTL Native**: `start` and `end` logical properties.
- **Max Width**: `max-w-6xl` for readability on ultrawide monitors.
- **Scroll Hijack**: Body is `overflow-hidden`, main container handles its own smooth scrolling.

## 5. Responsive Strategy
- **Mobile**: Stacks vertically, Quick Actions become a horizontal scroll snap, Hero reduces padding.
- **Tablet**: Bento grid style for stats.
- **Desktop**: Full expansive hero, hover states activated.

## 6. Motion Strategy (Spring Physics)
- **Entrance**: Staggered fade-up (`y: 20` to `0`).
- **Interactions**: Tap scale `0.98`, Hover scale `1.02`.
- **Transitions**: `type: "spring", stiffness: 300, damping: 30` to avoid linear "CSS" feeling.

## 7. Design Tokens Strategy
- **Colors**: Deep Zinc `#09090b` base, `amber-500` for primary action (Gold).
- **Glass**: `bg-zinc-900/40 backdrop-blur-xl border-zinc-800/50`.
- **Typography**: `Alexandria` for modern, geometric Arabic typography.

## 8. Accessibility Strategy
- `dir="rtl"` standard.
- Semantic HTML (header, main).
- High contrast gold on dark zinc passes WCAG.

## 9. Folder Structure
`/src`
  `/components`
    `/layout`
    `/workspace`
    `/overlays`
    `/ui`

## 10-12. Responsibilities, State, Performance
- **State**: Lifted overlay states to `App.tsx` for simplicity in this prototype.
- **Performance**: GPU accelerated transforms (`translateZ(0)`) via Framer Motion. Blurred layers are optimized by limiting their size.
