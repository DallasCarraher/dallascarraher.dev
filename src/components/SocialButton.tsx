interface ISocialButton {
  src: string
  alt: string
  link: string
}

export function SocialButton({ src, alt, link }: ISocialButton) {
  return (
    <a href={link} rel="noreferrer" target="_blank">
      <img
        src={src}
        alt={alt}
        className="h-10 bg-slate-200 rounded-full p-1.5 hover:bg-slate-300"
      />
    </a>
  )
}
