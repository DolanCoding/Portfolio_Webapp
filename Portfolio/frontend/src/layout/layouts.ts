import * as layoutHome from "./layoutHome";
// AI-LOGICAL-REGION: Responsive_Content_Padding
// Purpose: Replace fixed multi-unit based free space with proportional (1/6 each side) space snapped to nearest major grid line (10 * grid-size)
// Rationale: Keeps visual rhythm (major lines) while stabilizing proportions across varying viewport widths.

export const dynamicInnerGridPadding = () => {
    const r = document.documentElement.style;
    try {
        const blocksW = Number(r.getPropertyValue("--bp-blocks-W"));
        const gridUnitsW = blocksW * 10;       // guaranteed multiple of 10
        let padUnitsEach = gridUnitsW / 6;
        const moduloUnits = padUnitsEach % 10;

        if(moduloUnits > 5) {
            padUnitsEach += 10 - moduloUnits;
        }else{
            padUnitsEach -= moduloUnits;
        }

        const contentUnitsW = blocksW % 2 === 0 ? 80 : 70;
        r.setProperty("--bp-side-snap", `${padUnitsEach}`);
        r.setProperty("--bp-content-width", `${contentUnitsW}`);
    } catch(e) {
        console.warn("Responsive padding quantization failed", e);
    }
}

export const layoutAdjust = (pageName: string) => {
    const r = document.documentElement.style;
    try {
        if (pageName === "home") {
            layoutHome.layoutHeadline(r);
            layoutHome.layoutHomeText(r);
        } else if (pageName === "about") {
            r.setProperty("--bp-padding", "2rem");
        } else {
            r.setProperty("--bp-padding", "1.5rem");
        }
    } catch (e) {
        console.warn("Layout adjustment failed", e);
    }
}