# Arcade starter design

The supplied brief pins one retro arcade world. This starter extends that direction without introducing a separate branding exercise.

- Deep forest-charcoal background #101813; lime #c6f58b is the primary action color.
- Purple #c7a9ff identifies memory, coral #fbab98 identifies typing, yellow #f9df60 identifies the circle.
- Press Start 2P headings and DM Sans body, self-hosted through npm font packages.
- The hub is a compact game selector: horizontal game rows with distinct artwork, title, instructions and availability.
- Primary controls remain at least 46px high. Dense memory boards use smaller tiles to fit six columns on a phone.
- Focus is a visible yellow outline. Reduced motion removes transitions. No flashing CRT effects.
- Temporary memory backs form an abstract radial mosaic with board-position background offsets. Replace this surface with final poster artwork while retaining the offsets.

Game-specific CSS should live beside game components. Shared visual changes must be coordinated between pair branches.
