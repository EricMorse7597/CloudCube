export interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
  clickEvent?: () => void;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "Timer",
    href: "timer",
  },
  {
    label: "Trainers",
    href: "train",
    children: [
      {
        label: "CFOP cross trainer",
        href: "train/cross",
      },
      {
        label: "ZZ EO trainer",
        href: "train/eo",
      },
    ],
  },
  {
    label: "Tools",
    children: [
      {
        label: "One Handed Scrambles",
        href: "tools/ohscramble",
      },
      {
        label: "Definitions",
        href: "definitions",
      },
    ],
  },
  {
    label: "About",
    href: "about",
  },
  // {
  //   label: "",
  //   href: "dashboard",
  //   children: [
  //     {
  //       label: "logout",
  //       href: "logout",
  //     }
  //   ]
  // }
];

export default NAV_ITEMS;
