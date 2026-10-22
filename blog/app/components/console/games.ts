// Artwork from each game's LaunchBox image gallery; served locally for reliable transitions.
export type Game = {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  front: string;
  back: string;
  spine: string;
  disc: string;
  source: string;
};

export const games: Game[] = [
  {
    id: "jak-and-daxter",
    title: "Jak and Daxter",
    subtitle: "The Precursor Legacy",
    year: "2001",
    front: "/images/games/jak-and-daxter/front.webp",
    back: "/images/games/jak-and-daxter/back.webp",
    spine: "/images/games/jak-and-daxter/spine.webp",
    disc: "/images/discs/jak-and-daxter.png",
    source:
      "https://gamesdb.launchbox-app.com/games/images/4614-jak-and-daxter-the-precursor-legacy",
  },
  {
    id: "jak-ii",
    title: "Jak II",
    subtitle: "Welcome to Haven City",
    year: "2003",
    front: "/images/games/jak-ii/front.webp",
    back: "/images/games/jak-ii/back.webp",
    spine: "/images/games/jak-ii/spine.webp",
    disc: "/images/games/jak-ii/disc.webp",
    source: "https://gamesdb.launchbox-app.com/games/images/4616-jak-ii",
  },
  {
    id: "jak-3",
    title: "Jak 3",
    subtitle: "Into the Wasteland",
    year: "2004",
    front: "/images/games/jak-3/front.webp",
    back: "/images/games/jak-3/back.webp",
    spine: "/images/games/jak-3/spine.webp",
    disc: "/images/games/jak-3/disc.webp",
    source: "https://gamesdb.launchbox-app.com/games/images/4621-jak-3",
  },
];
