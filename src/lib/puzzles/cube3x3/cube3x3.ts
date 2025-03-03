import { Puzzle } from "../../types";
import { Move3x3, Facelet3x3, Cube3x3Mask } from ".";
import {
  MOVESETS,
  SOLVED_FACELET_CUBE,
  Moves,
  applyMove,
  getMaskedFaceletCube,
  printFaceletCube,
  getEO,
} from ".";

export class Cube3x3 implements Puzzle<Move3x3> {
  private state: Facelet3x3;
  private solvedState: Readonly<Facelet3x3>;
  private moves: Moves;

  constructor(
    moveSet: Readonly<Move3x3[]> = MOVESETS.Full,
    initialState: Readonly<Facelet3x3> = [...SOLVED_FACELET_CUBE],
    solvedState: Readonly<Facelet3x3> = initialState,
    history: Move3x3[] = []
  ) {
    this.state = [...initialState];
    this.solvedState = solvedState;
    this.moves = new Moves(moveSet, history);
  }
  /* ============== */
  /* ~~ Getters ~~ */
  /* =============*/

  /* returns array of all possible next moves */
  get nextMoves(): readonly Move3x3[] {
    return this.moves.nextMoves;
  }

  /* returns array of all moves made */
  get history(): Move3x3[] {
    return [...this.moves.history];
  }

  /* returns current state of the cube */
  get stateData(): Facelet3x3 {
    return [...this.state];
  }

  /* returns the edge orientation */
  get EO(): boolean[] {
    return getEO(this.state);
  }

  /* returns true if the cube is solved */
  isSolved(): boolean {
    return this.state.every(
      (facelet, index) => facelet === this.solvedState[index]
    );
  }

  /* sets the cube state to the solved state and clears history */
  resetToSolved(): this {
    this.state = [...this.solvedState];
    this.resetHistory();
    return this;
  }

  /* stringifies the cube state */
  encode(): string {
    return this.state.join("");
  }

  /* applies a move to the cube state */
  applyMove(move: Move3x3): this {
    this.state = applyMove(this.state, move);
    this.moves.addMove(move);
    return this;
  }

  /* applies a sequence of moves in array form */
  applyMoves(moves: Move3x3[]): this {
    moves.forEach((move) => this.applyMove(move));
    return this;
  }

  /* masks the cube given a valid mask pattern */
  applyMask(mask: Cube3x3Mask): this {
    this.state = getMaskedFaceletCube(mask, this.state);
    this.solvedState = getMaskedFaceletCube(mask, this.solvedState);
    return this;
  }

  /* writes the cube state to the console in emoji form */
  print() {
    printFaceletCube(this.state);
  }

  /* clones the cube */
  clone() {
    return new Cube3x3(
      this.moves.moveSet,
      this.state,
      this.solvedState,
      this.moves.history
    );
  }

  /* resets the move history */
  resetHistory(): this {
    this.moves.resetHistory();
    return this;
  }
}
