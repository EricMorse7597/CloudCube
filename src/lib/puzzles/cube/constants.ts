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
 
 export interface Face {
   color: Colors;
   tiles: Array<Colors>;
   above: Face | null;
   below: Face | null;
   next: Face | null;
   prev: Face | null;
 
 }

 export type Faces = {
   [key in FaceNames]: Face;
 };
 