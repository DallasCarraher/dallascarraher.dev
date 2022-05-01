import * as ReactDOM from 'react-dom'
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
  const [container] = React.useState(document.createElement(el))

  React.useEffect(() => {
    container.classList.add(className)
    document.body.appendChild(container)
    return () => {
      document.body.removeChild(container)
    }
  }, [className, container])

  return ReactDOM.createPortal(children, container)
}
