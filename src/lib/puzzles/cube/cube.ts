import {
  Colors,
  FaceNames,
  Faces,
  FaceColors,
  Face,
  relationships,
} from "./constants";

export class Cube {
  public readonly dims: number;

  public faces: Faces = {} as Faces;

  constructor(dims: number = 3) {
    this.dims = dims;
    const faceSize = dims * dims;

    // initialize the cube faces
    for (let faceName of Object.values(FaceNames)) {
      this.faces[faceName] = {
        color: FaceColors[faceName],
        tiles: Array(faceSize).fill(FaceColors[faceName]),
      };
    }

    // define the relationships between the faces
    for (const faceName of Object.values(FaceNames)) {
      const face = this.faces[faceName];
      const { above, below, next, prev } = relationships[faceName];
      face.above = this.faces[above];
      face.below = this.faces[below];
      face.next = this.faces[next];
      face.prev = this.faces[prev];
    }
  }

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
        const rowOffset = row * this.dims;
        for (let tile = rowOffset; tile < rowOffset + this.dims; tile++) {
          process.stdout.write(face.length ? mapping[face[tile]] : "  ");
        }
      }
      process.stdout.write("\n");
    }
  }

  private getRow(face: Face, row: number): Colors[] {
    const rowOffset = row * this.dims;
    return face.tiles.slice(rowOffset, rowOffset + this.dims);
  }

  private GetColumn(face: Face, column: number): Colors[] {
    return face.tiles.filter((_, index) => index % this.dims === column);
  }

  public rotateColumn(face: FaceNames, column: number, goUp: boolean): void {
    let currentFace = this.faces[face];
    let nextFace = goUp ? currentFace.above : currentFace.below;
    let columnColors = this.GetColumn(currentFace, column);

    do {
      const nextColumn = this.GetColumn(nextFace, column);
      nextFace.tiles = nextFace.tiles.map((color, index) =>
        index % this.dims === column ? columnColors.shift()! : color
      );
      columnColors = nextColumn;
      currentFace = nextFace;
      nextFace = goUp ? currentFace.above : currentFace.below;
    } while (currentFace !== this.faces[face]);
  }

  public rotateRow(face: FaceNames, row: number, goRight: boolean): void {
    let currentFace = this.faces[face];
    let nextFace = goRight ? currentFace.next : currentFace.prev;
    let rowColors = this.getRow(currentFace, row);

    do {
      const nextRow = this.getRow(nextFace, row);
      nextFace.tiles = nextFace.tiles.map((color, index) =>
        index >= row * this.dims && index < (row + 1) * this.dims
          ? rowColors.shift()!
          : color
      );
      rowColors = nextRow;
      currentFace = nextFace;
      nextFace = goRight ? currentFace.next : currentFace.prev;
    } while (currentFace !== this.faces[face]);
  }

  public rotateFace(face: FaceNames, goClockwise: boolean): void {
    const currentFace = this.faces[face];
    
  }
}

const cube: Cube = new Cube();
cube.printCube();
cube.rotateFace(FaceNames.front, true);
cube.printCube();