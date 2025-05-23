import {
  Colors,
  FaceNames,
  Face,
  Faces,
  FaceColors,
  relationships,
  directions,
  Tile,
  PatternName,
  Pattern,
} from "./constants";

export default class Cube {
  public readonly dims: number; // dimensions of the cube
  public faces: Faces = {} as Faces; // the faces of the cube

  constructor(dims: number = 3) {
    this.dims = dims;
    const faceSize: number = dims * dims;

    // initialize the cube faces
    for (const faceName of Object.values(FaceNames)) {
      // @ts-ignore: The other properties will be set after
      this.faces[faceName] = {
        color: FaceColors[faceName],
        tiles: Array(faceSize).fill({
          color: FaceColors[faceName],
          isMasked: false,
        }),
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
      const color: Colors = face.tiles[0].color;
      for (let tile of face.tiles) {
        if (tile.color !== color) {
          return false;
        }
      }
    }
    return true;
  }

  /* Will mask the cube using a cross trainer masking pattern */
  public maskCube(CrossColor: Colors): void {
    console.log("CrossColor", CrossColor);
    // retrieve the face name matching the cross color and get the relationships
    const crossFaceName: FaceNames = Object.keys(FaceColors).find(
      (key) => FaceColors[key as FaceNames] === CrossColor
    ) as FaceNames;
    console.log("crossFaceName", crossFaceName);
    const relationship = Object.values(relationships[crossFaceName]);

    // determine the appropriate pattern for each face and mask it
    for (const face in this.faces) {
      const rel = relationship.find((rel) => rel.name === face);
      let pattern = rel ? PatternName.line : PatternName.center;
      pattern = face === crossFaceName ? PatternName.cross : pattern;
      this.maskFace(this.faces[face as FaceNames], pattern, rel?.side || 0);
    }
  }

  /* clones the cube */
  public clone(): Cube {
    const newCube = new Cube(this.dims);
    for (const faceName of Object.values(FaceNames)) {
      newCube.faces[faceName].tiles = this.faces[faceName].tiles.map(
        (tile) => ({ ...tile })
      );
    }
    return newCube;
  }

  /* Encodes the cube into a string of characters representing the masked/unmasked state of the cube */
  public encode(): string {
    let encoded = "";
    encoded += this.encodeFaces([FaceNames.up]);
    encoded += this.encodeFaces([
      FaceNames.left,
      FaceNames.front,
      FaceNames.right,
      FaceNames.back,
    ]);
    encoded += this.encodeFaces([FaceNames.down]);

    return encoded;
  }

  /* Rotates a face of the cube in a given direction */
  public rotateFace(face: FaceNames, direction: directions): void {
    const currentFace: Face = this.faces[face];
    const matrix: Tile[][] = this.toMatrix(currentFace.tiles);
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

  /* Helper method to print multiple provided faces in an organized row */
  private printFaces(faces: Array<Tile>[]): void {
    /* Maps each colour to an emoji equivalent */
    const mapping: Record<Colors, string> = {
      white: "⬜",
      yellow: "🟨",
      green: "🟩",
      blue: "🟦",
      red: "🟥",
      orange: "🟧",
      masked: "⬛",
    };

    for (let row = 0; row < this.dims; row++) {
      for (let face of faces) {
        const rowOffset: number = row * this.dims;
        for (let tile = rowOffset; tile < rowOffset + this.dims; tile++) {
          if (face.length) {
            let color1: Colors = face[tile].isMasked
              ? Colors.masked
              : face[tile].color;
            process.stdout.write(mapping[color1]);
          } else {
            process.stdout.write("  ");
          }
        }
      }
      process.stdout.write("\n");
    }
  }
  /* Encodes all faces into a flattened string with each face being represented 
     by it's corresponding character, and masked tiles with 'X' */
  private encodeFaces(faceNames: FaceNames[]): string {
    let encoded = "";

    const mapping: Record<FaceNames, string> = {
      up: "U",
      down: "D",
      front: "F",
      back: "B",
      left: "L",
      right: "R",
    };

    for (let row = 0; row < this.dims; row++) {
      for (let name of faceNames) {
        const face: Face = this.faces[name];
        const rowOffset: number = row * this.dims;
        for (let tile = rowOffset; tile < rowOffset + this.dims; tile++) {
          let char: string = face.tiles[tile].isMasked ? "X" : mapping[name];
          encoded += char;
        }
      }
    }
    return encoded;
  }

  /* Maskes a face of the cube given a valid pattern and pattern rotation */
  private maskFace(
    face: Face,
    patternName: PatternName,
    rotation: number = 0
  ): void {
    const pattern = Pattern[patternName];
    let newTiles = face.tiles.map((tile) => ({ ...tile }));

    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i]) {
        newTiles[i].isMasked = true;
      }
    }

    let tempTiles = this.toMatrix(newTiles);
    for (let j = 0; j < rotation; j++) {
      tempTiles = this.rotateMatrix(tempTiles, directions.counterClockwise);
    }
    newTiles = tempTiles.flat();

    face.tiles = newTiles;
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
  private toMatrix(array: Tile[]): Tile[][] {
    const matrix: Tile[][] = [];
    for (let i = 0; i < this.dims; i++) {
      matrix.push(array.slice(i * this.dims, (i + 1) * this.dims));
    }
    return matrix;
  }

  /* Helper method to rotate the matrix */
  private rotateMatrix(matrix: any[][], direction: directions): any[][] {
    const len: number = matrix.length;
    const rotated = Array.from({ length: len }, () => Array(len).fill(null));

    for (let i = 0; i < len; i++) {
      for (let j = 0; j < len; j++) {
        if (direction === directions.clockwise) {
          rotated[j][len - 1 - i] = matrix[i][j];
        } else {
          rotated[len - 1 - j][i] = matrix[i][j];
        }
      }
    }

    return rotated;
  }
}
