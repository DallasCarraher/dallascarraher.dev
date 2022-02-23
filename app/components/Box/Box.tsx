import styles from './styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

type content = {
  link?: string
  img?: string
  alt?: string
  title?: string
  text?: string
}

export default function Box({ link, img, alt, title, text }: content) {
  return link ? (
    <a href={link} className="Box">
      {img && <img src={img} alt={alt} />}
      {title && <h3>{title}</h3>}
      {text && <p>{text}</p>}
    </a>
  ) : (
    <div className="Box unavailable">
      {img && <img src={img} alt={alt} />}
      {title && <h3>{title}</h3>}
      {text && <p>{text}</p>}
    </div>
  )
}
