export const menuItems = [
  { label: "About", href: "/about", number: "01", description: "PLAYER PROFILE" },
  { label: "Projects", href: "/projects", number: "02", description: "MEMORY CARD" },
  { label: "Blog", href: "/blog", number: "03", description: "SAVE JOURNAL" },
  { label: "Now Playing", href: "/now-playing", number: "04", description: "AUDIO PLAYER" },
  { label: "Contact", href: "/contact", number: "05", description: "NETWORK" },
] as const;

export const socialLinks = [
  { label: "GitHub", handle: "DallasCarraher", href: "https://github.com/DallasCarraher" },
  { label: "LinkedIn", handle: "dallascarraher", href: "https://linkedin.com/in/dallascarraher" },
];

export interface Project {
  title: string;
  description: string;
  href: string;
}
export interface Post {
  title: string;
  date: string;
  href: string;
}
export const projects: Project[] = [
  {
    title: "Minecraft Companion Bot",
    description:
      "An AI companion for Minecraft Java Edition that joins your realm and follows natural-language instructions to mine, build, craft, and explore. Built with TypeScript, Bun, and Mineflayer.",
    href: "https://github.com/DallasCarraher/minecraft-companion-bot",
  },
  {
    title: "Eco",
    description:
      "An experimental effort to bring Jak and Daxter: The Precursor Legacy to the browser with WebAssembly and WebGPU. Currently a browser prototype; not playable yet.",
    href: "https://github.com/DallasCarraher/Eco",
  },
];
export const posts: Post[] = [];
