import { Colors, FaceNames, Faces, FaceColors } from "./constants";

export class Cube {
  public readonly dims: number;

  public faces: Faces = {} as Faces;

  constructor(dims: number = 3) {
    this.dims = dims;
    const faceSize = dims * dims;
    let previous: Faces = {} as Faces;
    for (let faceName of Object.values(FaceNames)) {
      this.faces[faceName] = {
        color: FaceColors[faceName],
        tiles: Array(faceSize).fill(FaceColors[faceName]),
        above: null,
        below: null,
        next: null,
        prev: null,
      };
    }

    for (let faceName of Object.values(FaceNames)) {
      const face = this.faces[faceName];
      switch (faceName) {
        case FaceNames.front:
          face.above = previous[FaceNames.up];
          face.below = previous[FaceNames.down];
          face.next = previous[FaceNames.right];
          face.prev = previous[FaceNames.left];
          break;
        case FaceNames.back:
          face.above = previous[FaceNames.up];
          face.below = previous[FaceNames.down];
          face.next = previous[FaceNames.left];
          face.prev = previous[FaceNames.right];
          break;
        case FaceNames.left:
          face.above = previous[FaceNames.up];
          face.below = previous[FaceNames.down];
          face.next = previous[FaceNames.front];
          face.prev = previous[FaceNames.back];
          break;
        case FaceNames.right:
          face.above = previous[FaceNames.up];
          face.below = previous[FaceNames.down];
          face.next = previous[FaceNames.back];
          face.prev = previous[FaceNames.front];
          break;
        case FaceNames.up:
          face.above = previous[FaceNames.back];
          face.below = previous[FaceNames.front];
          face.next = previous[FaceNames.right];
          face.prev = previous[FaceNames.left];
          break;
        case FaceNames.down:
          face.above = previous[FaceNames.front];
          face.below = previous[FaceNames.back];
          face.next = previous[FaceNames.right];
          face.prev = previous[FaceNames.left];
          break;
      }
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

}

const cube: Cube = new Cube();
cube.printCube();
