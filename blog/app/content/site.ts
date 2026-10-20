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
export const projects: Project[] = [];
export const posts: Post[] = [];
