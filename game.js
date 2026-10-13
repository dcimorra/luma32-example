// El faro — an example cartridge for LUMA 32. The manifest: everything the console needs
// to know about the game, and where each part lives.
//
//   art/       the palette, every tile and prop, and the full-screen pictures, painted in code
//   cast.js    the people and the cat
//   maps/      one file per place
//   story.js   the thread of the story (one counter flag) and where things are
//   music.js   songs and the sea
//   locales/   every word the player reads, by key (nothing written in the code)
//
// The engine is imported as ../../engine/: the folder sits at public/games/el-faro/ of an
// engine checkout while it is made, and at the same depth when luma32.com serves it.
import { SCREEN_W } from '../../engine/gfx.js';
import { drawText, drawBig, measure, measureBig } from '../../engine/font.js';
import { t } from '../../engine/i18n.js';
import { C } from './art/palette.js';
import { tiles } from './art/tiles.js';
import { lighthouseView } from './art/views.js';
import { dolls } from './cast.js';
import { harbor } from './maps/harbor.js';
import { lighthouse } from './maps/lighthouse.js';
import { songs, ambiences } from './music.js';
import { STAGE, PLACE } from './story.js';

const title = {
  music: 'harbor',
  intro: 60,
  pressY: 128,
  draw(ctx, f) {
    lighthouseView(ctx, 0, 0, SCREEN_W, 160, f);
    const name = t('meta.title');
    drawBig(ctx, name, Math.round((SCREEN_W - measureBig(name, 3)) / 2) - 30, 34, C.paper, 3);
    const sub = t('meta.tagline');
    drawText(ctx, sub, Math.round((SCREEN_W - measure(sub)) / 2) - 30, 70, C.paper);
  },
};

function cover(ctx, x, y, w, h, f) {
  lighthouseView(ctx, x, y, w, h, f);
  const name = t('meta.title');
  drawText(ctx, name, x + Math.round((w - measure(name)) / 2), y + 10, C.paper);
}

export default {
  id: 'el-faro',
  meta: { title: 'meta.title', tagline: 'meta.tagline' },
  strings: ['locales/es/common.json'],
  theme: {
    shell: { body: '#3a3a7a', bodyHi: '#6a6ab8', bodyLo: '#1c1c48', accent1: '#ffd860', accent2: '#c83c46' },
    ui: {
      border: '#2a1a2e', light: '#c8b8e0', fill: '#fbf4e4', text: '#2a1a2e', shadow: '#e0d4c0', accent: '#c83c46',
      speakers: { tomas: { color: '#2a3a6a', voice: 420 }, marta: { color: '#a8781e', voice: 720 }, leo: { color: '#3a7a3a', voice: 900 } },
    },
  },
  tiles,
  dolls,
  maps: { harbor, lighthouse },
  songs,
  ambiences,
  player: 'hero',
  title,
  cover,
  direct: true,
  // SELECT: what the story wants now
  async onSelect(api) { await api.say(null, api.save.objective || 'obj.none', { style: 'box' }); },
  // one entry per beat, leaving the game where a player would be there: tools/audit.mjs
  // checks every one, and ?dev=1 offers them on the title
  dev: { jumps: [
    { label: 'the keeper', run: async (api) => { api.set('story', STAGE.arrived); await api.warp('lighthouse', 4, 6, 'up'); api.objective('obj.lighthouse', 'tomas'); } },
    { label: 'Marta', run: async (api) => { api.set('story', STAGE.asked); api.quest('light', 'open', { quiet: true }); await api.warp('harbor', 6, 12, 'up'); api.objective('obj.marta', 'marta'); } },
    { label: 'the cat', run: async (api) => { api.set('story', STAGE.toMarta); api.quest('light', 'open', { quiet: true }); await api.warp('harbor', 8, 5, 'up'); api.objective('obj.cat', 'bruma'); } },
    { label: 'the lamp', run: async (api) => { api.set('story', STAGE.matches); api.quest('light', 'open', { quiet: true }); await api.warp('lighthouse', 4, 5, 'up'); api.objective('obj.lamp', { x: PLACE.lamp[0], y: PLACE.lamp[1], w: 2 }); } },
  ] },
  async newGame(api) {
    await api.warp('harbor', 3, 5, 'right');
  },
};
