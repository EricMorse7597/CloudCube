import {
  Colors,
  FaceNames,
  Face,
  Faces,
  FaceColors,
  relationships,
  directions,
} from "./constants";

export class Cube {
  public readonly dims: number; // dimensions of the cube
  public faces: Faces = {} as Faces; // the faces of the cube

  constructor(dims: number = 3) {
    this.dims = dims;
    const faceSize: number = dims * dims;

    // initialize the cube faces
    for (let faceName of Object.values(FaceNames)) {

      // @ts-ignore: The other properties will be set in the next loop
      this.faces[faceName] = {
        color: FaceColors[faceName],
        tiles: Array(faceSize).fill(FaceColors[faceName]),
      };
    }

    // define the relationships between the faces
    for (const faceName of Object.values(FaceNames)) {
      const face: Face = this.faces[faceName];
      const { above, below, next, prev } = relationships[faceName];
      face.above = this.faces[above.name];
      face.below = this.faces[below.name];
      face.next = this.faces[next.name];
      face.prev = this.faces[prev.name];
    }
  }

  /* Returns true if the cube is in a solved state */
  public isSolved(): boolean {
    for (let faceName of Object.values(FaceNames)) {
      const face: Face = this.faces[faceName];
      const color: Colors = face.tiles[0];
      for (let tile of face.tiles) {
        if (tile !== color) {
          return false;
        }
      }
    }
    return true;
  }

  /* Debug tool to print the cube state */
  public printCube(): void {
    console.log();
    this.printFaces([[], this.faces.up.tiles]);
    this.printFaces([
      this.faces.left.tiles,
      this.faces.front.tiles,
      this.faces.right.tiles,
      this.faces.back.tiles,
    ]);
    this.printFaces([[], this.faces.down.tiles]);
  }

  /* Rotates a face of the cube in a given direction */
  public rotateFace(face: FaceNames, direction: directions): void {
    const currentFace: Face = this.faces[face];
    const matrix: Colors[][] = this.toMatrix(currentFace.tiles);
    this.rotateAdjacentTiles(face, direction);
    currentFace.tiles = this.rotateMatrix(matrix, direction).flat();
  }

  /* Scrambles the cube given a string in scramble notation */
  public performScramble(movements: string): void {
    /* Validate notation */
    const regex: RegExp = new RegExp(`^([FBLRUD]2?'?( |$))+`);
    if (!regex.test(movements)) {
      throw new Error("Invalid scramble notation");
    }

    const moves: string[] = movements.split(" ");

    /* Perform each move in the scramble */
    for (const move of moves) {
      const direction: directions = move.includes("'")
        ? directions.counterClockwise
        : directions.clockwise;
      const numRotations: number =
        move.length > 1 && parseInt(move[1]) === 2 ? 2 : 1;

      let face: FaceNames;
      switch (move[0]) {
        case "B":
          face = FaceNames.back;
          break;
        case "L":
          face = FaceNames.left;
          break;
        case "R":
          face = FaceNames.right;
          break;
        case "U":
          face = FaceNames.up;
          break;
        case "D":
          face = FaceNames.down;
          break;
        default:
          face = FaceNames.front;
          break;
      }

      for (let i = 0; i < numRotations; i++) {
        this.rotateFace(face, direction);
      }
    }
  }

  /* Helper method to print multiple provided faces in an organized row */
  private printFaces(faces: Array<Colors>[]): void {
    /* Maps each colour to an emoji equivalent */
    const mapping: Record<Colors, string> = {
      white: "⬜",
      yellow: "🟨",
      green: "🟩",
      blue: "🟦",
      red: "🟥",
      orange: "🟧",
    };

    for (let row = 0; row < this.dims; row++) {
      for (let face of faces) {
        const rowOffset: number = row * this.dims;
        for (let tile = rowOffset; tile < rowOffset + this.dims; tile++) {
          process.stdout.write(face.length ? mapping[face[tile]] : "  ");
        }
      }
      process.stdout.write("\n");
    }
  }

  /* Helper method to rotate the surrounding tiles on adjacent faces */
  private rotateAdjacentTiles = (
    faceName: FaceNames,
    direction: directions
  ): void => {
    const relationship =
      direction === directions.clockwise
        ? Object.values(relationships[faceName])
        : Object.values(relationships[faceName]).reverse();

    let nextIndex,
      curIndex = 0;
    let nextRel,
      currentRel = relationship[curIndex];
    let newTiles;

    for (let i = 0; i < relationship.length + 1; i++) {
      nextIndex = (curIndex + 1) % relationship.length;
      nextRel = relationship[nextIndex];

      let currentTiles = this.toMatrix(this.faces[currentRel.name].tiles);

      // rotate tiles correctly
      for (let j = 0; j < currentRel.side; j++) {
        currentTiles = this.rotateMatrix(currentTiles, directions.clockwise);
      }

      let tilesHolder = [...currentTiles[0]];

      if (newTiles) {
        currentTiles[0] = [...newTiles];
      }
      newTiles = tilesHolder;

      // rotate back
      for (let j = 0; j < currentRel.side; j++) {
        currentTiles = this.rotateMatrix(
          currentTiles,
          directions.counterClockwise
        );
      }

      this.faces[currentRel.name].tiles = currentTiles.flat();

      curIndex = nextIndex;
      currentRel = nextRel;
    }
  };

  /* Helper method to convert a 1D array to a 2D matrix. this helps with doing transformations */
  private toMatrix(array: Colors[]): Colors[][] {
    const matrix: Colors[][] = [];
    for (let i = 0; i < this.dims; i++) {
      matrix.push(array.slice(i * this.dims, (i + 1) * this.dims));
    }
    return matrix;
  }

  public setCube(movements: string): void {
    const regex = new RegExp(`^([FBLRUD]2?'?( |$))+`);
    if (!regex.test(movements)) {
      throw new Error("Invalid scramble notation");
    }

    const moves = movements.split(" ");
    for (const move of moves) {
      console.log(move);
      const direction: boolean = !move.includes("'");
      let face: FaceNames;
      switch (move[0]) {
        case "B":
          face = FaceNames.back;
          break;
        case "L":
          face = FaceNames.left;
          break;
        case "R":
          face = FaceNames.right;
          break;
        case "U":
          face = FaceNames.up;
          break;
        case "D":
          face = FaceNames.down;
          break;
        default:
          face = FaceNames.front;
          break;
      }

      let numRotations: number = (move.length > 1 && parseInt(move[1]) === 2)? 2 : 1;
      console.log(face, direction, numRotations);
      for (let i = 0; i < numRotations; i++) {
        this.rotateFace(face, direction);
        cube.printCube();
      }

    }
  }

}

const cube: Cube = new Cube(3);
cube.printCube();
cube.setCube("D2 F D' B L' F2 D R D F' U2 B U2 F' U2 F' U2 B' D2 F' L2");
cube.printCube();
