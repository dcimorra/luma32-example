// Full-screen pictures: the lighthouse against the dusk (title, cover) and at night, lit
// (behind the end credits). One drawing, two hours of the day, so they always match.
import { C } from './palette.js';

export function lighthouseView(ctx, x, y, w, h, f, { night = false } = {}) {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, C.night);
  g.addColorStop(0.55, night ? '#2a2e5a' : C.sky);
  g.addColorStop(1, night ? '#3a3a6a' : C.skyHi);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);
  if (night) {
    ctx.fillStyle = C.paper;
    for (let i = 0; i < 24; i++) if ((i * 7 + Math.floor(f / 25)) % 9) ctx.fillRect(x + ((i * 53) % w), y + ((i * 29) % Math.round(h * 0.5)), 1, 1);
  }
  const sea = Math.round(h * 0.72);
  ctx.fillStyle = night ? C.seaLo : C.sea;
  ctx.fillRect(x, y + sea, w, h - sea);
  const lx = x + Math.round(w * 0.72);
  const ly = y + Math.round(h * 0.3);
  const band = Math.max(2, Math.round(h * 0.065));
  ctx.fillStyle = C.ink;
  ctx.fillRect(lx - 1, ly - 1, 10, band * 6 + 4);
  for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? C.red : C.white; ctx.fillRect(lx, ly + 2 + i * band, 8, band); }
  const lit = night || Math.floor(f / 20) % 3;
  ctx.fillStyle = lit ? C.lamp : C.stone;
  ctx.fillRect(lx + 1, ly - 5, 6, 5);
  // at night the beam sweeps the water
  if (night) {
    const a = (f / 90) % (Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 216, 96, 0.18)';
    ctx.beginPath();
    ctx.moveTo(lx + 4, ly - 3);
    ctx.lineTo(lx + 4 + Math.cos(a) * w, ly - 3 + Math.abs(Math.sin(a)) * h * 0.6 - 6);
    ctx.lineTo(lx + 4 + Math.cos(a + 0.15) * w, ly - 3 + Math.abs(Math.sin(a + 0.15)) * h * 0.6 + 6);
    ctx.closePath();
    ctx.fill();
  }
}
