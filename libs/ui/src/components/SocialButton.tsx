

export interface SocialButtonProps {
  src: string;
  alt: string;
  link: string;
}

export const SocialButton = ({ src, alt, link }: SocialButtonProps) => {
  return (
    <a href={link} rel="noreferrer" target="_blank">
      <img
        src={src}
        alt={alt}
        className="h-10 bg-slate-200 rounded-full p-1.5 hover:bg-slate-300 transition-colors"
      />
    </a>
  );
};
