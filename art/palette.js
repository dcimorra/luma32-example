// The palette of the harbour at dusk. Every colour the cartridge paints comes from here.
//
// - Dusk: warm light from the west, shadows lean violet, never grey.
// - Outlines are `ink`, a dark plum: never pure black.
// - Every material has a base, a highlight (Hi) and a shadow (Lo).
// - `lamp` (the lighthouse's light) is the one saturated colour: it is what the story is about.
export const C = {
  ink: '#2a1a2e',
  sea: '#3a5a9a', seaHi: '#7aa0d8', seaLo: '#2a3e72',
  sand: '#e0c49a', sandHi: '#f0dab4', sandLo: '#c4a27a',
  stone: '#8a8296', stoneHi: '#aaa2b4', stoneLo: '#6a6278',
  wood: '#8a5a3a', woodHi: '#a87650', woodLo: '#5e3a2a',
  roof: '#b04a4a', roofHi: '#d06a5e', roofLo: '#7e3040',
  wall: '#e8dcc8', wallHi: '#f6eee0', wallLo: '#c4b49c',
  white: '#f4f0e8', red: '#c83c46',
  grass: '#5a8a5a', grassHi: '#76a46a', grassLo: '#40684a',
  sky: '#f0a070', skyHi: '#ffd2a0', night: '#141a34', paper: '#fbf4e4',
  lamp: '#ffd860', lampHi: '#fff4c0',
};
