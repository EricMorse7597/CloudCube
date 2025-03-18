import { method } from "lodash";

export interface DefinitionItem {
    label: string;
    text: string;
    category: category;
    imgHref?: string;
}

export enum category {
    Move,
    Method,
    Algorithm,
    Term,
    Competition,
}

const DEFINITION_ITEMS: Array<DefinitionItem> = [
    {
        label: "R",
        text: "Right face clockwise",
        category: category.Move,
        imgHref: "/assets/r.png",
    },
    {
        label: "R'",
        text: "Right face counter clockwise",
        category: category.Move,
        imgHref: "/assets/rprime.png",
    },
    {
        label: "L",
        text: "Left face clockwise",
        category: category.Move,
        imgHref: "/assets/l.png",
    },
    {
        label: "L'",
        text: "Left face counter clockwise",
        category: category.Move,
        imgHref: "/assets/lprime.png",
    },
    {
        label: "U",
        text: "Up face clockwise",
        category: category.Move,
        imgHref: "/assets/u.png",
    },
    {
        label: "U'",
        text: "Up face counter clockwise",
        category: category.Move,
        imgHref: "/assets/uprime.png",
    },
    {
        label: "D",
        text: "Down face clockwise",
        category: category.Move,
        imgHref: "/assets/d.png",
    },
    {
        label: "D'",
        text: "Down face counter clockwise",
        category: category.Move,
        imgHref: "/assets/dprime.png",
    },
    {
        label: "F",
        text: "Front face clockwise",
        category: category.Move,
        imgHref: "/assets/f.png",
    },
    {
        label: "F'",
        text: "Front face counter clockwise",
        category: category.Move,
        imgHref: "/assets/fprime.png",
    },
    {
        label: "B",
        text: "Back face clockwise",
        category: category.Move,
        imgHref: "/assets/b.png",
    },
    {
        label: "B'",
        text: "Back face counter clockwise",
        category: category.Move,
        imgHref: "/assets/bprime.png",
    },
    {
        label: "CFOP (Cross, F2L, OLL, PLL) ",
        text: "The most popular 3x3 speedcubing method.",
        category: category.Method,
    },
    {
        label: "Cross ",
        text: "Solving the first-layer cross.",
        category: category.Method,
    },
    {
        label: "F2L (First Two Layers) ",
        text: "Pairing up and inserting corner-edge pairs.",
        category: category.Method,
    },
    {
        label: "OLL (Orientation of the Last Layer) ",
        text: "Making the top face a uniform color.",
        category: category.Method,
    },
    {
        label: "PLL (Permutation of the Last Layer) ",
        text: "Moving pieces to their correct spots.",
        category: category.Method,
    },
    {
        label: "ZZ (Zbigniew Zborowski Method) ",
        text: "A speedcubing method that reduces cube rotations:",
        category: category.Method,
    },
    {
        label: "EOLine ",
        text: "Solving the edges' orientation while making a partial cross.",
        category: category.Method,
    },
    {
        label: "F2L ",
        text: "Solving the first two layers without cube rotations.",
        category: category.Method,
    },
    {
        label: "LL (Last Layer) ",
        text: "Can be solved with fewer algorithms compared to CFOP.",
        category: category.Method,
    },
    {
        label: "Roux ",
        text: "A block-building method using fewer moves:",
        category: category.Method,
    },
    {
        label: "First Block (FB) ",
        text: "Solving a 1x2x3 block on one side.",
        category: category.Method,
    },
    {
        label: "Second Block (SB) ",
        text: "Solving another 1x2x3 block on the opposite side.",
        category: category.Method,
    },
    {
        label: "CMLL (Corner of Last Layer) ",
        text: "Orienting and permuting last-layer corners.",
        category: category.Method,
    },
    {
        label: "LSE (Last Six Edges) ",
        text: "Solving the remaining edges with minimal moves.",
        category: category.Method,
    },
    {
        label: "Petrus Method ",
        text: "A method that focuses on minimizing cube rotations by building a 2x2x2 block first.",
        category: category.Method,
    },
    {
        label: "Heise Method ",
        text: "A more intuitive method with minimal algorithms, focused on efficiency.",
        category: category.Method,
    },
    {
        label: "OLL (Orientation of the Last Layer)",
        text: "A set of 57 algorithms for orienting all last-layer pieces.",
        category: category.Algorithm,
    },
    {
        label: "PLL (Permutation of the Last Layer)",
        text: "A set of 21 algorithms for permuting last-layer pieces.",
        category: category.Algorithm,
    },
    {
        label: "OLLCP (OLL + Corner Permutation)",
        text: "Solving OLL while permuting last-layer corners.",
        category: category.Algorithm,
    },
    {
        label: "ZBLL (Zborowski-Bruchem Last Layer)",
        text: "Solving the entire last layer in one step.",
        category: category.Algorithm,
    },
    {
        label: "Winter Variation (WV)",
        text: "A technique for solving F2L + OLL in one step.",
        category: category.Algorithm,
    },
    {
        label: "COLL (Corners of the Last Layer)",
        text: "A method for solving the last-layer corners while orienting them.",
        category: category.Algorithm,
    },
    {
        label: "Lookahead ",
        text: "Planning moves while executing the current step to increase efficiency.",
        category: category.Term,
    },
    {
        label: "Finger Tricks ",
        text: "Efficient finger movements to execute algorithms quickly.",
        category: category.Term,
    },
    {
        label: "TPS (Turns Per Second) ",
        text: "The number of moves executed per second.",
        category: category.Term,
    },
    {
        label: "Roux Style M Moves ",
        text: "Fast M-slice turning technique used in Roux.",
        category: category.Term,
    },
    {
        label: "OH (One-Handed Solving) ",
        text: "Solving a cube using only one hand, often using special finger tricks.",
        category: category.Term,
    },
    {
        label: "Big Cube Reduction ",
        text: "A method for solving 4x4+ cubes by reducing them to a 3x3 state.",
        category: category.Term,
    },
    {
        label: "Parity Errors ",
        text: "Situations that occur on even-layered cubes (4x4, 6x6) due to hidden edge swaps.",
        category: category.Term,
    },
    {
        label: "WCA (World Cube Association)",
        text: "The governing body for official cubing competitions.",
        category: category.Competition,
    },
    {
        label: "DNF (Did Not Finish)",
        text: "A solve that is disqualified in competition.",
        category: category.Competition,
    },
    {
        label: "DNS (Did Not Start)",
        text: "A solve where the competitor did not begin.",
        category: category.Competition,
    },
    {
        label: "Scramble",
        text: "A predefined sequence of moves to randomize the cube before a solve.",
        category: category.Competition,
    },
    {
        label: "Inspection Time",
        text: "The 15-second period before a solve to inspect the cube.",
        category: category.Competition,
    },
    {
        label: "Stackmat Timer",
        text: "The standard timer used in competitions.",
        category: category.Competition,
    },
    {
        label: "PB (Personal Best)",
        text: "A cuber's fastest solve time.",
        category: category.Competition,
    },
    {
        label: "WR (World Record)",
        text: "The fastest solve time ever recorded in an official competition.",
        category: category.Competition,
    },
    {
        label: "AO5 (Average of 5)",
        text: "A common speedcubing average, where the best and worst solves are dropped.",
        category: category.Competition,
    },
    {
        label: "AO12 (Average of 12)",
        text: "The average of 12 solves, dropping the best and worst.",
        category: category.Competition,
    },
];

export default DEFINITION_ITEMS;
