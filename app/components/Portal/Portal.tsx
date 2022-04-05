import ReactDOM from 'react-dom'
import * as React from 'react'

type Props = {
  children?: React.ReactNode
  className?: string
  el: string
}

/**
 * Portal will dynamically create a dom element for portal node and render children
 */
export default function Portal({
  children,
  className = 'root-portal',
  el,
}: Props) {
  // until the client loads, don't run.
  if (!document) return null

  const [container] = React.useState(() => {
    return document.createElement(el)
  })

  React.useEffect(() => {
    container.classList.add(className)
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [])

  return ReactDOM.createPortal(children, container)
}
