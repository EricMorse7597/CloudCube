export interface DefinitionItem {
    label: string;
    text: string;
    imgHref?: string;
}

const DEFINITION_ITEMS: Array<DefinitionItem> = [
    {
        label: "CFOP",
        text: "Cross, F2L, OLL, PLL",
    },
    {
        label: "ZZ",
        text: "EOLine, F2L, LL",
    },
    {
        label: "R",
        text: "Right face clockwise",
        imgHref: "/assets/r.png",
    },
    {
        label: "R'",
        text: "Right face counter clockwise",
        imgHref: "/assets/rprime.png",
    },
    {
        label: "L",
        text: "Left face clockwise",
        imgHref: "/assets/l.png",
    },
    {
        label: "L'",
        text: "Left face counter clockwise",
        imgHref: "/assets/lprime.png",
    },
    {
        label: "U",
        text: "Up face clockwise",
        imgHref: "/assets/u.png",
    },
    {
        label: "U'",
        text: "Up face counter clockwise",
        imgHref: "/assets/uprime.png",
    },
    {
        label: "D",
        text: "Down face clockwise",
        imgHref: "/assets/d.png",
    },
    {
        label: "D'",
        text: "Down face counter clockwise",
        imgHref: "/assets/dprime.png",
    },
    {
        label: "F",
        text: "Front face clockwise",
        imgHref: "/assets/f.png",
    },
    {
        label: "F'",
        text: "Front face counter clockwise",
        imgHref: "/assets/fprime.png",
    },
    {
        label: "B",
        text: "Back face clockwise",
        imgHref: "/assets/b.png",
    },
    {
        label: "B'",
        text: "Back face counter clockwise",
        imgHref: "/assets/bprime.png",
    }
];

export default DEFINITION_ITEMS;
