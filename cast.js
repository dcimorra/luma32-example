// Who is in the game: people and the cat, as doll specs (engine/doll.js, engine/creature.js).
// The named characters are told apart at a glance by silhouette and colour.
export const dolls = {
  hero: { skin: '#e8b48c', hair: '#3a2a1a', hairStyle: 'short', top: '#3a6ab0', bottom: '#2a3040' },
  // Tomás, the keeper: an old sailor, a beard and a cap
  tomas: { skin: '#d8a07a', hair: '#e8e4dc', hairStyle: 'receding', beard: 'full', beardColor: '#e8e4dc', top: '#2a3a6a', bottom: '#2a2a3a', hat: 'cap', hatColor: '#1a2240', coat: '#2a3a6a' },
  // Marta, who sells fish at the stall
  marta: { skin: '#c48c64', hair: '#5a2a1a', hairStyle: 'bun', top: '#c8a040', bottom: '#4a3a5a', dress: true },
  // a boy mending a net on the dock: someone to make the place
  leo: { skin: '#f0c8a0', hair: '#c87a3a', hairStyle: 'mop', top: '#5a9a5a', bottom: '#3a4a6a' },
  // Bruma, Marta's cat: grey, with white socks
  bruma: { creature: 'cat', fur: '#8a8a9a', markings: '#f0ece4', nose: '#e08a8a' },
};
