// The thread of the story as one counter flag, `story`: the whole state is in the save and
// every map rebuilds itself from it. Stages go in tens so a beat added later fits between
// two others without breaking anybody's save.
export const STAGE = { arrived: 10, asked: 20, toMarta: 30, catFound: 40, matches: 50, lit: 60 };
export const at = (api) => api.get('story') || 0;
export const advance = (api, n) => { if (at(api) < n) api.set('story', n); };

// Where things are, shared by the maps, the objectives and the dev jumps.
export const PLACE = {
  lighthouseDoor: [16, 8],   // the harbour: the cell of the lighthouse's door
  marta: [6, 10],            // Marta, behind her stall
  catDock: [9, 2],           // where Bruma hides, at the end of the dock
  catHome: [4, 11],          // where Bruma goes back to
  lamp: [4, 3],              // the lamp upstairs (bottom-left cell of the prop)
};
