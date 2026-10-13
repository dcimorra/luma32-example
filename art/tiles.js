// Tiles and props, painted in code (engine/gfx.js, Painter). A tile is 16×16; a prop may be
// bigger and is anchored at its bottom-left cell, its `foot` the cells that block.
import { C } from './palette.js';

export const tiles = {
  // the sea moves in its highlights, not as a whole: 3 frames, slow
  sea: { solid: true, frames: 3, reflect: 0.35, step: 'water', draw(p, f) {
    p.fill(C.sea);
    p.noise(0, 0, 16, 16, [C.seaLo], 0.12);
    for (let i = 0; i < 3; i++) p.hline((i * 6 + f * 3) % 14, 3 + i * 5, 3, C.seaHi);
  } },
  sand: { step: 'soft', draw(p) { p.fill(C.sand); p.noise(0, 0, 16, 16, [C.sandHi, C.sandLo], 0.14); } },
  // where the sand meets the sea: foam along the top
  shore: { step: 'soft', draw(p, f) {
    p.fill(C.sand); p.noise(0, 4, 16, 12, [C.sandHi, C.sandLo], 0.14);
    p.rect(0, 0, 16, 3, C.sea); p.hline(0, 3, 16, C.seaHi); p.hline((f * 5) % 12, 4, 4, C.white);
  }, frames: 3 },
  cobble: { step: 'hard', draw(p) {
    p.fill(C.stone);
    for (let y = 0; y < 16; y += 4) for (let x = (y % 8 ? 2 : 0); x < 16; x += 5) { p.rect(x, y, 4, 3, C.stoneHi); p.hline(x, y + 3, 4, C.stoneLo); }
  } },
  grass: { draw(p) { p.fill(C.grass); p.noise(0, 0, 16, 16, [C.grassHi, C.grassLo], 0.18); } },
  dock: { step: 'wood', draw(p) {
    p.fill(C.wood);
    for (let x = 0; x < 16; x += 4) { p.vline(x, 0, 16, C.woodLo); p.vline(x + 1, 0, 16, C.woodHi); }
  } },
  // inside the lighthouse: a round room, whitewashed, a stone floor
  wall_top: { solid: true, draw(p) { p.fill(C.ink); p.rect(0, 0, 16, 14, C.stoneLo); p.hline(0, 0, 16, C.stone); } },
  wall: { solid: true, draw(p) { p.fill(C.wall); p.hline(0, 0, 16, C.wallHi); p.rect(0, 13, 16, 3, C.wallLo); p.hline(0, 7, 16, C.wallLo); } },
  window: { solid: true, draw(p) { p.fill(C.wall); p.rect(4, 2, 8, 9, C.ink); p.rect(5, 3, 6, 7, C.sky); p.rect(5, 3, 6, 2, C.skyHi); p.rect(0, 13, 16, 3, C.wallLo); } },
  floor: { step: 'hard', draw(p) { p.fill(C.stoneLo); for (let y = 0; y < 16; y += 8) for (let x = (y ? 4 : 0); x < 16; x += 8) p.rect(x, y, 7, 7, C.stone); } },
  // the way out: walking into it leaves (a warp on a solid tile)
  door_out: { solid: true, draw(p) { p.fill(C.wall); p.rect(3, 1, 10, 15, C.ink); p.rect(4, 2, 8, 14, C.wood); p.vline(8, 2, 14, C.woodLo); } },

  // ---------- props ----------
  house: { size: [4, 3], foot: [4, 2], examine: 'harbor.house', draw(p) {
    p.rect(1, 18, 62, 30, C.ink); p.rect(2, 19, 60, 28, C.wall); p.hline(2, 19, 60, C.wallHi);
    p.rect(0, 2, 64, 18, C.ink); p.rect(1, 3, 62, 15, C.roof); p.rect(1, 3, 62, 3, C.roofHi); p.hline(1, 17, 62, C.roofLo);
    for (const x of [8, 44]) { p.rect(x, 26, 12, 10, C.ink); p.rect(x + 1, 27, 10, 8, C.lamp); p.vline(x + 6, 27, 8, C.ink); }
    p.rect(26, 30, 12, 18, C.ink); p.rect(27, 31, 10, 17, C.wood);
  } },
  // the lighthouse from outside: red and white bands, the lantern on top. Its door is the
  // bottom-left cell of its foot.
  lighthouse: { size: [2, 6], foot: [2, 1], draw(p) {
    p.rect(4, 26, 24, 70, C.ink);
    for (let y = 27; y < 95; y += 12) { p.rect(5, y, 22, 6, C.white); p.rect(5, y + 6, 22, 6, C.red); }
    p.rect(2, 16, 28, 11, C.ink); p.rect(6, 6, 20, 12, C.ink); p.rect(8, 8, 16, 9, C.stoneLo); p.rect(3, 17, 26, 3, C.stone);
    p.rect(12, 2, 8, 5, C.ink); p.rect(12, 84, 8, 12, C.ink); p.rect(13, 85, 6, 11, C.wood);
  } },
  stall: { size: [3, 2], foot: [3, 1], counter: true, draw(p) {
    p.rect(0, 2, 48, 8, C.ink); for (let x = 1; x < 47; x += 8) { p.rect(x, 3, 4, 6, C.white); p.rect(x + 4, 3, 4, 6, C.red); }
    p.vline(2, 10, 12, C.wood); p.vline(45, 10, 12, C.wood);
    p.rect(0, 20, 48, 12, C.ink); p.rect(1, 21, 46, 10, C.wood); p.hline(1, 21, 46, C.woodHi);
    for (let x = 6; x < 44; x += 9) { p.ellipse(x, 19, 3, 2, C.seaHi); p.px(x - 2, 19, C.ink); }
  } },
  crates: { size: [1, 1], examine: 'harbor.crates', draw(p) { p.rect(1, 3, 14, 13, C.ink); p.rect(2, 4, 12, 11, C.woodHi); p.line(2, 4, 13, 14, C.woodLo); p.line(13, 4, 2, 14, C.woodLo); } },
  boat: { size: [3, 1], foot: [3, 1], flat: true, draw(p) { p.ellipse(24, 10, 22, 5, C.ink); p.ellipse(24, 9, 20, 4, C.roof); p.hline(6, 7, 36, C.roofHi); } },
  // the lamp upstairs; its light, once lit, is the map's (maps/lighthouse.js)
  lamp: { size: [2, 2], foot: [2, 1], draw(p) {
    p.rect(4, 4, 24, 26, C.ink); p.rect(6, 6, 20, 20, C.stoneLo); p.rect(10, 10, 12, 12, C.stone); p.rect(2, 26, 28, 6, C.wood);
  } },
};
