import styles from './styles.css'
import * as React from 'react'
import useSSRLayoutEffect from '~/hooks/useSSRLayoutEffect'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}

type Props = {
  children: JSX.Element | JSX.Element[]
  imgRef?: React.RefObject<HTMLImageElement>
  p?: number
}

export default function Skeleton({ children, imgRef }: Props) {
  function initial(): boolean {
    if (imgRef) {
      console.log(imgRef.current)
      return imgRef.current === null ? true : false
    }
    return true
  }

  const [loading, setLoading] = React.useState<boolean>(() => initial())

  useSSRLayoutEffect(() => {
    setTimeout(() => {
      if (imgRef && imgRef.current?.complete) setLoading(false)
    }, 300)
  }, [])

  const rootChild = {
    className: '',
    type: '',
  }

  if (Array.isArray(children)) {
    rootChild.className = children[0].props.className
    rootChild.type = children[0].type
  } else {
    rootChild.className = children.props.className
    rootChild.type = children.type
  }

  const SkeletonElement = React.createElement(rootChild.type, {
    className: rootChild.className
      ? `${rootChild.className} skeleton`
      : `${rootChild.type} skeleton`,
  })

  return (
    <>
      <div>{loading && SkeletonElement}</div>
      <div className={loading ? 'hidden' : ''}>{children}</div>
    </>
  )
}
