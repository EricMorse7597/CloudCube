import {
  Colors,
  FaceNames,
  Faces,
  FaceColors,
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
      face.above = this.faces[above.name];
      face.below = this.faces[below.name];
      face.next = this.faces[next.name];
      face.prev = this.faces[prev.name];
    }
  }

  public isSolved(): boolean {
    for (let faceName of Object.values(FaceNames)) {
      const face = this.faces[faceName];
      const color = face.tiles[0];
      for (let tile of face.tiles) {
        if (tile !== color) {
          return false;
        }
      }
    }
    return true;
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



  private rotateMatrix(matrix: any[][], goClockwise: boolean): any[][] {
    const n = matrix.length;
    const rotated = Array.from({ length: n }, () => Array(n).fill(null));
  
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (goClockwise) {
          rotated[j][n - 1 - i] = matrix[i][j];
        } else {
          rotated[n - 1 - j][i] = matrix[i][j];
        }
      }
    }
  
    return rotated;
  }


  public rotateAdjacentTiles = (faceName: FaceNames, goClockwise: boolean): void => {

    const relationship = goClockwise? Object.values(relationships[faceName]): Object.values(relationships[faceName]).reverse();
    
    let nextIndex, curIndex = 0;
    let nextRel, currentRel = relationship[curIndex];
    let newTiles;

    for (let i = 0; i < relationship.length + 1; i++) {
      nextIndex = (curIndex + 1) % relationship.length;
      nextRel = relationship[nextIndex];

      let currentTiles = this.toMatrix(this.faces[currentRel.name].tiles);

      // rotate tiles correctly
      for (let j = 0; j < currentRel.side; j++) {
        currentTiles = this.rotateMatrix(currentTiles, true);
      }

      let tilesHolder = [...currentTiles[0]];
      
      if (newTiles) {
        currentTiles[0] = [...newTiles];
      }
      newTiles = tilesHolder;

      // rotate back
      for (let j = 0; j < currentRel.side; j++) {
        currentTiles = this.rotateMatrix(currentTiles, false);
      }

      this.faces[currentRel.name].tiles = currentTiles.flat();

      curIndex = nextIndex;
      currentRel = nextRel;
    }



  }

  public rotateFace(face: FaceNames, goClockwise: boolean): void {
    const currentFace = this.faces[face];
    const matrix = this.toMatrix(currentFace.tiles);
    this.rotateAdjacentTiles(face, goClockwise);
    currentFace.tiles = this.rotateMatrix(matrix, goClockwise).flat();
    
  }

  private toMatrix(array: Colors[]): Colors[][] {
    const matrix: Colors[][] = [];
    for (let i = 0; i < this.dims; i++) {
      matrix.push(array.slice(i * this.dims, (i + 1) * this.dims));
    }
    return matrix;
  }

}

const cube: Cube = new Cube(3);
cube.printCube();
cube.rotateFace(FaceNames.front, true);
cube.printCube();
