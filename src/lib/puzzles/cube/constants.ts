export enum Colors {
   white = "white",
   yellow = "yellow",
   green = "green",
   blue = "blue",
   red = "red",
   orange = "orange",
 }

 export enum FaceNames {
   front = "front",
   back = "back",
   left = "left",
   right = "right",
   up = "up",
   down = "down",
 }

 export const FaceColors: Record<FaceNames, Colors> = {
   [FaceNames.front]: Colors.white,
   [FaceNames.back]: Colors.yellow,
   [FaceNames.left]: Colors.blue,
   [FaceNames.right]: Colors.green,
   [FaceNames.up]: Colors.red,
   [FaceNames.down]: Colors.orange,
 };


export const relationships: Record<FaceNames, { above: FaceNames; below: FaceNames; next: FaceNames; prev: FaceNames }> = {
   [FaceNames.front]: { above: FaceNames.up, below: FaceNames.down, next: FaceNames.right, prev: FaceNames.left },
   [FaceNames.back]: { above: FaceNames.down, below: FaceNames.up, next: FaceNames.left, prev: FaceNames.right },
   [FaceNames.left]: { above: FaceNames.up, below: FaceNames.down, next: FaceNames.front, prev: FaceNames.back },
   [FaceNames.right]: { above: FaceNames.down, below: FaceNames.up, next: FaceNames.back, prev: FaceNames.front },
   [FaceNames.up]: { above: FaceNames.back, below: FaceNames.front, next: FaceNames.right, prev: FaceNames.left },
   [FaceNames.down]: { above: FaceNames.front, below: FaceNames.back, next: FaceNames.right, prev: FaceNames.left },
};

 export interface Face {
   color: Colors;
   tiles: Colors[];
   above: Face;
   below: Face;
   next: Face;
   prev: Face;
 
 }

 export type Faces = {
   [key in FaceNames]: Face;
 };
 