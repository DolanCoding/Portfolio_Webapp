export interface SolveParams {
  wCss: number;
  hCss: number;

  // Root font-size in px (1rem). Required.
  remPx?: number;
}

export interface SolveResult {
  renderable: boolean;
  reason?: string;

  u: number;          // chosen unit (px)
  blocksW: number;    // 10×unit blocks horizontally
  blocksH: number;    // 10×unit blocks vertically

  padLeft: number;    // L = R
  padRight: number;
  padTop: number;     // T = B
  padBottom: number;

  exact: boolean;     // kept for compatibility
  horizontalGap: number;
  verticalGap: number;
}

const EPS = 1e-6;

export default function solveAlignment(params: SolveParams): SolveResult {
  if (!params.wCss || !params.hCss || !params.remPx) {
    return no("Missing required parameters.", 0);
  }
  const W = params.wCss;
  const H = params.hCss;
  const remPx = params.remPx;

  const minBlocksW = 9;
  const minBlocksH = 6;

  // --- Rem & padding ---------------------------------------------------------
  // remPx is provided by caller (root font-size in px)
  const MIN_PAD = 2.5 * remPx; // per side
  const MAX_PAD = 3.5 * remPx;

  // --- Axis capacity (uniform rules, no landscape/portrait special-casing) ---
  const capW = (W - 2 * MIN_PAD) / (10 * minBlocksW);
  const capH = (H - 2 * MIN_PAD) / (10 * minBlocksH);
  // --- Define the more restricting axis ---
  let maxU: number;
  if(W > H){
    maxU = capH; // restrict by height as height is smaller.
  }else{
    maxU = capW; // restrict by width as width is smaller.
  }
  // check if maxU is less than remPx
  if (maxU < remPx) {
    return no("Cannot keep 1rem squares while satisfying minimum blocks on both axes.", remPx);
  }

  
  /*
  const gridMinW = W - 2 * MAX_PAD;
  const gridMaxW = W - 2 * MIN_PAD;
  const gridMinH = H - 2 * MAX_PAD;
  const gridMaxH = H - 2 * MIN_PAD;

  // --- maximum increment in px from padding ---
  const maxPadAdjust = (MAX_PAD - MIN_PAD) * 2;

  for(let u = maxU; u >= 0; u -= 0.001){
    if(u === 0){
      console.log("No solution found");
    }
    const moduloW = gridMaxW % (10 * u);
    const moduloH = gridMaxH % (10 * u);
    if (moduloW <= maxPadAdjust && moduloH <= maxPadAdjust) {
      console.log("initial Padding = ", MIN_PAD)
      console.log("maxPadAdjust:", maxPadAdjust);
      console.log("u = ", u);
      console.log("moduloW = ", moduloW);
      console.log("moduloH = ", moduloH);
      console.log("vertical adjusted padding = ",MIN_PAD + (moduloH / 2))
      console.log("vertical padding < max padding ? ",MIN_PAD + (moduloH / 2) < MAX_PAD)
      console.log("horizontal adjusted padding = ",MIN_PAD + (moduloW / 2))
      console.log("horizontal padding < max padding ? ",MIN_PAD + (moduloW / 2) < MAX_PAD)
      break;
    }
  }
  */
  // --- Helpers for sizing ----------------------------------------------------
  const unitFor = (axisPx: number, kBlocks: number) => (axisPx - 2 * MIN_PAD) / (10 * kBlocks);

  // Unit bounds: readable floor (1rem) .. axis cap (maxU)
  const unitFloor = remPx;
  const unitCeil = maxU;

  // Scoring-based candidate search:
  // - enumerate quantized u values (0.5px) in the allowed range
  // - skip candidates that can't host min blocks
  // - score by padding violation (strong) + distance from remPx (weak)
  // - pick lowest score so transitions are smooth and continuous
  const step = 0.5;
  let bestScore = Number.POSITIVE_INFINITY;
  let best: { u: number; nW: number; nH: number; padX: number; padY: number } | null = null;

  for (let uCand = unitFloor; uCand <= unitCeil + EPS; uCand += step) {
    const q = Number(Math.round(uCand * 2) / 2);
    const nWcand = Math.floor((W - 2 * MIN_PAD) / (10 * q));
    const nHcand = Math.floor((H - 2 * MIN_PAD) / (10 * q));
    if (nWcand < minBlocksW || nHcand < minBlocksH) continue;
    const gridW = 10 * nWcand * q;
    const gridH = 10 * nHcand * q;
    const padXcand = (W - gridW) / 2;
    const padYcand = (H - gridH) / 2;

    // pad violations (zero if inside range)
    const padViolationX = Math.max(0, MIN_PAD - padXcand, padXcand - MAX_PAD);
    const padViolationY = Math.max(0, MIN_PAD - padYcand, padYcand - MAX_PAD);
    const padPenalty = padViolationX * padViolationX + padViolationY * padViolationY;

    // prefer values near remPx to avoid large sudden density changes
    const unitDist = Math.abs(q - remPx);
    const unitPenalty = unitDist * 0.1;

    const score = padPenalty * 1000 + unitPenalty;

    if (score < bestScore) {
      bestScore = score;
      best = { u: q, nW: nWcand, nH: nHcand, padX: padXcand, padY: padYcand };
    }
  }

  if (!best) {
    return no("No unit found that keeps min blocks.", remPx);
  }

  // If best has tiny violations but is otherwise the best, accept it to ensure
  // continuous rendering. Padding will be the computed padX/padY (may slightly exceed MAX_PAD).
  let u = best.u;
  let nW = best.nW;
  let nH = best.nH;
  const padX = best.padX;
  const padY = best.padY;

  return ok(u, nW, nH, padX, padY);
}

// -----------------------------------------------------------------------------
// helpers
function ok(u: number, blocksW: number, blocksH: number, padX: number, padY: number): SolveResult {
  return {
    renderable: true,
    u,
    blocksW,
    blocksH,
    padLeft: padX,
    padRight: padX,
    padTop: padY,
    padBottom: padY,
    exact: true,
    horizontalGap: 0,
    verticalGap: 0,
  };
}

function no(reason: string, u: number): SolveResult {
  return {
    renderable: false,
    reason,
    u,
    blocksW: 0,
    blocksH: 0,
    padLeft: 0,
    padRight: 0,
    padTop: 0,
    padBottom: 0,
    exact: false,
    horizontalGap: 0,
    verticalGap: 0,
  };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
