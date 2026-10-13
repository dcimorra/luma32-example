// The harbour at dusk: the sea to the north with a wooden dock, the village street, Marta's
// stall, and the lighthouse on the east. After the lamp is lit, night falls over it.
import { STAGE, at, advance, PLACE } from '../story.js';

export const harbor = {
  name: 'place.harbor',
  music: 'harbor',
  ambience: 'sea',
  legend: { '~': 'sea', '-': 'shore', ':': 'sand', '.': 'cobble', ',': 'grass', '=': 'dock' },
  ground: [
    '~~~~~~~~~~~~~~~~~~~~',
    '~~~~~~~~==~~~~~~~~~~',
    '~~~~~~~~==~~~~~~~~~~',
    '~~~~~~~~==~~~~~~~~~~',
    '--------==----------',
    '::::::::::::::::::::',
    ',,::::::::::::::::,,',
    ',,................,,',
    ',,................,,',
    ',,................,,',
    ',,................,,',
    ',,................,,',
    ',,................,,',
    ',,,,,,,,,,,,,,,,,,,,',
  ],
  props: [
    { t: 'house', x: 1, y: 8 },
    { t: 'house', x: 10, y: 8 },
    { t: 'lighthouse', x: 16, y: 8 },
    { t: 'stall', x: 5, y: 11 },
    { t: 'crates', x: 14, y: 11 },
    { t: 'crates', x: 15, y: 11 },
    { t: 'boat', x: 11, y: 2 },
  ],
  actors: [
    { id: 'marta', doll: 'marta', x: PLACE.marta[0], y: PLACE.marta[1], dir: 'down', look: 3, talk: async (api) => {
      const s = at(api);
      if (s < STAGE.asked) await api.say('marta', 'harbor.marta_idle');
      else if (s < STAGE.toMarta) {
        await api.say('marta', 'harbor.marta_ask');
        advance(api, STAGE.toMarta);
        api.objective('obj.cat', 'bruma');
        api.persist();
      } else if (s < STAGE.catFound) await api.say('marta', 'harbor.marta_wait');
      else if (s < STAGE.matches) {
        await api.emote('marta', 'heart');
        await api.say('marta', 'harbor.marta_thanks');
        api.sfx('item');
        await api.narrate('harbor.got_matches');
        advance(api, STAGE.matches);
        api.objective('obj.lamp', { map: 'lighthouse', x: PLACE.lamp[0], y: PLACE.lamp[1], w: 2 });
        api.persist();
      } else await api.say('marta', 'harbor.marta_after');
    } },
    { id: 'bruma', doll: 'bruma', x: PLACE.catDock[0], y: PLACE.catDock[1], dir: 'down', talk: async (api, self) => {
      if (at(api) < STAGE.toMarta) { await api.emote('bruma', 'zzz'); return; }
      if (at(api) >= STAGE.catFound) { await api.emote('bruma', 'heart'); return; }
      await api.emote('bruma', 'note');
      await api.narrate('harbor.cat_found');
      advance(api, STAGE.catFound);
      api.objective('obj.marta_back', 'marta');
      api.persist();
      await self.walkTo(PLACE.catHome[0], PLACE.catHome[1], { timeout: 6000, place: true });
      self.face('down');
    } },
    // someone who is just there, making the place: he answers, and the story never needs him
    { id: 'leo', doll: 'leo', x: 8, y: 4, dir: 'down', look: 2, talk: async (api) => {
      await api.say('leo', at(api) >= STAGE.toMarta && at(api) < STAGE.catFound ? 'harbor.leo_cat' : 'harbor.leo');
    } },
  ],
  warps: [
    // walking into the lighthouse's door (it is as wide as the tower: both cells)
    { x: PLACE.lighthouseDoor[0], y: PLACE.lighthouseDoor[1], to: 'lighthouse', at: [4, 7], face: 'up', dir: 'up' },
    { x: PLACE.lighthouseDoor[0] + 1, y: PLACE.lighthouseDoor[1], to: 'lighthouse', at: [4, 7], face: 'up', dir: 'up' },
  ],
  // night, once the lamp is lit: dark, cut by the lighthouse's beam and the windows
  dark: (api) => (at(api) >= STAGE.lit ? { color: '#141a34', alpha: 0.7 } : null),
  lights: [
    { x: 17, y: 2, r: 6, color: '#ffd860', flicker: 0.05 },
    { x: 2, y: 7, r: 2, color: '#ffc870' }, { x: 4, y: 7, r: 2, color: '#ffc870' },
    { x: 11, y: 7, r: 2, color: '#ffc870' }, { x: 13, y: 7, r: 2, color: '#ffc870' },
  ],
  grade: (api) => (at(api) >= STAGE.lit ? null : '#ffe0c8'),
  // every arrival (and every "continue"): put the cat where the story has her; the intro once
  async enter(api) {
    if (at(api) >= STAGE.catFound) api.actor('bruma')?.place(PLACE.catHome[0], PLACE.catHome[1], 'down');
    if (at(api) >= STAGE.lit) api.music('night');
    if (at(api) >= STAGE.arrived) return;
    advance(api, STAGE.arrived);
    await api.narrate('harbor.intro');
    api.objective('obj.lighthouse', { x: PLACE.lighthouseDoor[0], y: PLACE.lighthouseDoor[1] });
    api.persist();
  },
};
