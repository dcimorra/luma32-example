// Inside the lighthouse: one round room, the keeper and the lamp. Lighting it is the end.
import { STAGE, at, advance, PLACE } from '../story.js';
import { lighthouseView } from '../art/views.js';

export const lighthouse = {
  name: 'place.lighthouse',
  music: 'keeper',
  legend: { '#': 'wall_top', W: 'wall', O: 'window', '.': 'floor', D: 'door_out' },
  ground: [
    '#########',
    'WWOWWWOWW',
    '#.......#',
    '#.......#',
    '#.......#',
    '#.......#',
    '#.......#',
    '#.......#',
    '####D####',
  ],
  props: [{ t: 'lamp', x: PLACE.lamp[0], y: PLACE.lamp[1], id: 'lamp' }],
  // a dim room, lit by its two windows; once the lamp burns, by the lamp
  dark: { color: '#2a1a3a', alpha: 0.4 },
  lights: (api) => [
    { x: 2, y: 2, r: 2, color: '#ffc890' }, { x: 6, y: 2, r: 2, color: '#ffc890' },
    ...(at(api) >= STAGE.lit ? [{ x: PLACE.lamp[0], y: PLACE.lamp[1] - 1, dx: 16, r: 7, color: '#ffd860', flicker: 0.1 }] : []),
  ],
  actors: [
    { id: 'tomas', doll: 'tomas', x: 2, y: 4, dir: 'right', look: 3, talk: async (api) => {
      const s = at(api);
      if (s < STAGE.asked) {
        await api.say('tomas', 'lighthouse.tomas_hello');
        // a choice: "no" changes nothing but his face, and he asks again next time
        const yes = await api.ask('tomas', 'lighthouse.tomas_ask', ['lighthouse.yes', 'lighthouse.no']);
        if (yes !== 0) { await api.emote('tomas', 'sad'); await api.say('tomas', 'lighthouse.tomas_no'); return; }
        await api.say('tomas', 'lighthouse.tomas_yes');
        api.choose('helped_tomas', 0);
        advance(api, STAGE.asked);
        api.quest('light');
        api.objective('obj.marta', { actor: 'marta', map: 'harbor' });
        api.persist();
      } else if (s < STAGE.matches) await api.say('tomas', 'lighthouse.tomas_wait');
      else if (s < STAGE.lit) await api.say('tomas', 'lighthouse.tomas_go');
      else await api.say('tomas', 'lighthouse.tomas_after');
    } },
  ],
  // pressing A at the lamp, with the matches: the end
  spots: [{ x: PLACE.lamp[0], y: PLACE.lamp[1], w: 2, h: 1, when: (api) => at(api) >= STAGE.matches && at(api) < STAGE.lit, run: async (api) => {
    await api.narrate('lighthouse.strike');
    api.sfx('confirm');
    await api.flash('#fff4c0');
    advance(api, STAGE.lit);
    api.quest('light', 'done');
    api.objective(false);
    api.persist();
    await api.say('tomas', 'lighthouse.tomas_lit');
    await api.fadeOut(600);
    await api.warp('harbor', 15, 10, 'up');
    await api.fadeIn(900);
    await api.narrate('harbor.night');
    await api.credits({ lines: ['credits.thanks', { title: 'credits.made', names: ['credits.who'] }], music: 'night', bg: (ctx, f) => lighthouseView(ctx, 0, 0, 240, 160, f, { night: true }) });
    api.end();
  } }],
  warps: [{ x: 4, y: 8, to: 'harbor', at: [PLACE.lighthouseDoor[0], PLACE.lighthouseDoor[1] + 1], face: 'down', dir: 'down' }],
};
