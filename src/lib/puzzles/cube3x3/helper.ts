import { Move3x3, Facelet3x3, Cube3x3Mask } from ".";
import { SOLVED_FACELET_CUBE, MOVE_PERMS, isValidMove, Facelet } from ".";

/* modifies a cube state with a given move and returns the result */
export function applyMove(state: Facelet3x3, move: Move3x3): Facelet3x3 {
  const nextState = [...state];
  const perms = MOVE_PERMS[move];
  perms.forEach(([src, dst]) => {
    nextState[dst] = state[src];
  });
  return nextState;
}

/* maps a mask onto a cube state and returns the updated state */
export function getMaskedFaceletCube(
  mask: Cube3x3Mask,
  stateData: Readonly<Facelet3x3> = SOLVED_FACELET_CUBE
): Facelet3x3 {
  return [...Array(54).keys()].map((faceletIdx) => {
    if (mask.solvedFaceletIndices.includes(faceletIdx)) {
      return stateData[faceletIdx];
    }
    if (mask.eoFaceletIndices?.includes(faceletIdx)) {
      return "O";
    }
    return "X";
  });
}

/* cleans scramble notation data to ensure move is valid and in an predictable form. splits string into array of moves */
export function parseNotation(input: string): Move3x3[] | null {
  const moves: string[] = input
    .trim() // remove whitespace padding
    .replaceAll(/[’`]/g, "'") // replace incorrect apostrophes
    .split(/\s+/) // split the string by whitespace into an array of moves
    .filter((m) => m); // remove empty moves
  if (!moves.every(isValidMove)) return null;
  return moves;
}

/* converts the cube state to an emoji string representation and writes the result to console */
export function printFaceletCube(cube: Facelet3x3): void {
  const faceletToEmoji = (f: Facelet): string =>
    ({
      R: "🟥",
      L: "🟧",
      U: "⬜",
      D: "🟨",
      F: "🟩",
      B: "🟦",
      O: "🟪",
      X: "⬛",
    }[f]);

  const xxx = "➖➖➖";
  const xxxxxx = "➖➖➖➖➖➖";
  const xxxxxxxxxxxx = "➖➖➖➖➖➖➖➖➖➖➖➖";

  const emojiCube = cube.map(faceletToEmoji);
  const slice = (start: number, end: number) =>
    emojiCube.slice(start, end).join("");
  console.log(xxxxxxxxxxxx);
  console.log(xxx + slice(0, 3) + xxxxxx);
  console.log(xxx + slice(3, 6) + xxxxxx);
  console.log(xxx + slice(6, 9) + xxxxxx);
  console.log(slice(9, 21));
  console.log(slice(21, 33));
  console.log(slice(33, 45));
  console.log(xxx + slice(45, 48) + xxxxxx);
  console.log(xxx + slice(48, 51) + xxxxxx);
  console.log(xxx + slice(51, 54) + xxxxxx);
  console.log(xxxxxxxxxxxx);
}

/**
 * Recognizes Edge Orientation (EO) with respect to the F/B axis. In other words, which edges may be solved using R, L, U, D moves.
 * @param stateData The state of a facelet cube
 * @param preRotation Rotations to apply before recognizing EO.
 * @returns whether each edge is good or bad, in the order [UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB]
 */
export function getEO(facelets: Readonly<Facelet3x3>): boolean[] {
  // To recognize edge orientation, we need to look at two "orbits" (sets of facelet locations) for edges.
  // We call one of them the "primary orbit" and the other the "secondary orbit".
  // Each edge has two facelets, one of them will always be in the primary orbit and the other in the secondary orbit.
  // The edge facelets are indexed in the order [UB, UL, UR, UF, BL, FL, FR, BR, DF, DL, DR, DB] for these constants.
  const PRIMARY_ORBIT: Readonly<number[]> = [
    1, 3, 5, 7, 32, 24, 26, 30, 46, 48, 50, 52,
  ];
  const SECONDARY_ORBIT: Readonly<number[]> = [
    19, 10, 16, 13, 21, 23, 27, 29, 37, 34, 40, 43,
  ];

  const uCenterFacelet = facelets[4];
  const dCenterFacelet = facelets[49];
  const lCenterFacelet = facelets[22];
  const rCenterFacelet = facelets[28];
  const colorsBelongingInPrimaryOrbit: Array<Facelet> = [
    uCenterFacelet,
    dCenterFacelet,
    "O",
  ];
  const colorsBelongingInSecondaryOrbit: Array<Facelet> = [
    lCenterFacelet,
    rCenterFacelet,
  ];

  return [...Array(12).keys()].map((index) => {
    const faceletOnPrimaryOrbit = facelets[PRIMARY_ORBIT[index]];
    const faceletOnSecondaryOrbit = facelets[SECONDARY_ORBIT[index]];
    return (
      colorsBelongingInPrimaryOrbit.includes(faceletOnPrimaryOrbit) ||
      colorsBelongingInSecondaryOrbit.includes(faceletOnSecondaryOrbit)
    );
  });
}
