import styles from './styles.css'
import Skeleton, {
  links as skeletonLinks,
} from '~/components/Skeleton/Skeleton'
import * as React from 'react'

export function links() {
  return [...skeletonLinks(), { rel: 'stylesheet', href: styles }]
}

type content = {
  link?: string
  img: string
  alt: string
  title: string
  text: string
  categories: string[]
}

export default function Box({
  link,
  img,
  alt,
  title,
  text,
  categories,
}: content) {
  const imgRef = React.useRef<HTMLImageElement>(null)

  return link ? (
    <a href={link} className="Box">
      <Skeleton imgRef={imgRef}>
        <img src={img} alt={alt} ref={imgRef} />
      </Skeleton>
      <h3>{title}</h3>
      <p>{text}</p>
      <div className="category-tags-container">
        {categories.map((category, ix) => (
          <div key={`${category}.text.${ix}`} className="category-tag">
            {category}
          </div>
        ))}
      </div>
    </a>
  ) : (
    <div className="Box unavailable">
      {img && <img src={img} alt={alt} />}
      {title && <h3>{title}</h3>}
      {text && <p>{text}</p>}
    </div>
  )
}
