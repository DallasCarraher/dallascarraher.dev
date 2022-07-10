import { Button } from 'ariakit/button'

interface ISocialButton {
  src: string
  alt: string
  link: string
}

export function SocialButton({ src, alt, link }: ISocialButton) {
  return (
    <>
      <Button as="a" href={link} rel="no-referrer" target="_blank">
        <img
          src={src}
          alt={alt}
          className="h-10 bg-slate-200 rounded-full p-1.5 hover:bg-slate-300"
        />
      </Button>
    </>
  )
}
