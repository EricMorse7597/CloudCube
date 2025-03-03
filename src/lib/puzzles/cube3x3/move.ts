import { Move3x3 } from ".";
import { MOVESETS, sameLayerOrAxis, layerOfLayerMove, isLayerMove } from ".";

export class Moves {
  private moveHistory: Move3x3[];

  constructor(
    private moveset: Readonly<Move3x3[]> = MOVESETS.Full,
    history: Move3x3[] = []
  ) {
    this.moveHistory = [...history];
  }

  /* returns a list of all possible moves */
  get moveSet(): Move3x3[] {
    return [...this.moveset];
  }

  /* returns a list of all moves made */
  get history(): Move3x3[] {
    return [...this.moveHistory];
  }

  /* returns an array of all possible next moves */
  get nextMoves(): readonly Move3x3[] {
    return this.moveSet.filter((move) => this.isMoveAvailable(move));
  }

  /* resets the move history */
  public resetHistory(): void {
    this.moveHistory = [];
  }

  /* adds a move to the move history */
  public addMove(move: Move3x3): void {
    this.moveHistory.push(move);
  }

  /* determines if a move is allowed given the last move. Will filter out redundant moves */
  private isMoveAvailable(move: Move3x3): boolean {
    const lastMove = this.moveHistory.at(-1);
    if (lastMove && sameLayerOrAxis(move, lastMove)) {
      return false;
    }

    if (lastMove && isLayerMove(lastMove) && isLayerMove(move)) {
      // R L and L R are the same. To reduce redundant solutions, after L moves disallow R
      // same for U D and F B
      // follow convention of sorting these parallel moves as R L, F B, U D
      const lastMoveLayer = layerOfLayerMove(lastMove);
      const thisMoveLayer = layerOfLayerMove(move);
      if (
        (lastMoveLayer === "L" && thisMoveLayer === "R") ||
        (lastMoveLayer === "D" && thisMoveLayer === "U") ||
        (lastMoveLayer === "B" && thisMoveLayer === "F")
      ) {
        return false;
      }
    }
    return true;
  }
}
