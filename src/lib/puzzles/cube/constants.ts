export enum Colors {
  white = "white",
  yellow = "yellow",
  green = "green",
  blue = "blue",
  red = "red",
  orange = "orange",
  masked = "masked",
}

export enum FaceNames {
  front = "front",
  back = "back",
  left = "left",
  right = "right",
  up = "up",
  down = "down",
}

export enum directions {
  clockwise,
  counterClockwise,
}

export const FaceColors: Record<FaceNames, Colors> = {
  [FaceNames.front]: Colors.green,
  [FaceNames.back]: Colors.blue,
  [FaceNames.left]: Colors.orange,
  [FaceNames.right]: Colors.red,
  [FaceNames.up]: Colors.white,
  [FaceNames.down]: Colors.yellow,
};

export interface Tile {
  color: Colors;
  isMasked: boolean;
}

export interface Face {
  color: Colors;
  tiles: Tile[];
  above: Face;
  below: Face;
  next: Face;
  prev: Face;
}

export type Faces = {
  [key in FaceNames]: Face;
};

/* Used to define the relationships of adjacent faces relative to a given face */
export type Relationships = "above" | "below" | "next" | "prev";

/* Used to define the side the adjacent face meets the given face */
export enum Sides {
  top,
  left,
  bottom,
  right,
}

/* Defines the connections of adjacent faces to a provided face */
export const relationships: Record<
  FaceNames,
  { [key in Relationships]: { name: FaceNames; side: Sides } }
> = {
  [FaceNames.front]: {
    above: { name: FaceNames.up, side: Sides.bottom },
    next: { name: FaceNames.right, side: Sides.left },
    below: { name: FaceNames.down, side: Sides.top },
    prev: { name: FaceNames.left, side: Sides.right },
  },
  [FaceNames.back]: {
    above: { name: FaceNames.up, side: Sides.top },
    next: { name: FaceNames.left, side: Sides.left },
    below: { name: FaceNames.down, side: Sides.bottom },
    prev: { name: FaceNames.right, side: Sides.right },
  },
  [FaceNames.left]: {
    above: { name: FaceNames.up, side: Sides.left },
    next: { name: FaceNames.front, side: Sides.left },
    below: { name: FaceNames.down, side: Sides.left },
    prev: { name: FaceNames.back, side: Sides.right },
  },
  [FaceNames.right]: {
    above: { name: FaceNames.up, side: Sides.right },
    next: { name: FaceNames.back, side: Sides.left },
    below: { name: FaceNames.down, side: Sides.right },
    prev: { name: FaceNames.front, side: Sides.right },
  },
  [FaceNames.up]: {
    above: { name: FaceNames.back, side: Sides.top },
    next: { name: FaceNames.right, side: Sides.top },
    below: { name: FaceNames.front, side: Sides.top },
    prev: { name: FaceNames.left, side: Sides.top },
  },
  [FaceNames.down]: {
    above: { name: FaceNames.front, side: Sides.bottom },
    next: { name: FaceNames.right, side: Sides.bottom },
    below: { name: FaceNames.back, side: Sides.bottom },
    prev: { name: FaceNames.left, side: Sides.bottom },
  },
};

export enum PatternName {
  cross,
  center,
  line,
  all,
}

export const Pattern: Record<PatternName, Boolean[]> = {
  [PatternName.cross]: [true, false, true, false, false, false, true, false, true],
  [PatternName.center]: [true, true, true, true, false, true, true, true, true],
  [PatternName.line]: [true, false, true, true, true, true, true, true, true],
  [PatternName.all]: [true, true, true, true, true, true, true, true, true],
};
