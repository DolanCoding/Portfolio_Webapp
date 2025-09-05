// AI-AGENT CONTEXT: FILE=layoutHome.ts | ROLE=Page_Layout_Module | PURPOSE=Home page specific layout helpers (headline column distribution)
// Distributes content width into 3 columns aligned to major grid (10u blocks).
// Rule update: Any remainder (1 or 2 major blocks) after equal division goes entirely to the CENTER column
// so the center column is larger than the two side columns by exactly the leftover amount.
export const layoutHeadline = (r: CSSStyleDeclaration) => {
  const gridUnitSize = Number(r.getPropertyValue("--bp-grid-size").replace("px", ""));
  const contentUnits = Number(r.getPropertyValue("--bp-content-width")) || 0;

  if (contentUnits <= 0) {
    console.warn("layoutHeadline: content width unavailable");
    return;
  }

  const centerContentUnits = 30;
  const side = (contentUnits - centerContentUnits) / 2;

  const sideModulo = side % 10;
  const bubblesW = sideModulo !== 0 ? `${15 * gridUnitSize}px` : `${20 * gridUnitSize}px`;

  r.setProperty("--home-hl-side", `${side * gridUnitSize}px`);
  r.setProperty("--home-hl-center", `${centerContentUnits * gridUnitSize}px`);
  r.setProperty("--bubbles-offset", `${10 * gridUnitSize}px`);
  r.setProperty("--bubblesW", bubblesW);
};

export const layoutHomeText = (r: CSSStyleDeclaration) => {
  const contentWidth = Number(r.getPropertyValue("--bp-content-width"));
  const gridUnitSize = Number(r.getPropertyValue("--bp-grid-size").replace("px", ""));

  const buttonWidth = contentWidth === 80 ? `${30 * gridUnitSize}px` : `${20 * gridUnitSize}px`;

  r.setProperty("--home-text-button-width", buttonWidth);
}