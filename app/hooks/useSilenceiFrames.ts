import * as React from 'react'

export default function useSilenceiFrames() {
  React.useEffect(() => {
    setTimeout(() => {
      console.log('ran')
      const iframes = Array.from(document.getElementsByTagName('iframe'))
      for (const item of iframes) {
        console.log('found!', item.contentWindow.console)
        item.contentWindow.console.log = () => {}
      }
    }, 100)
  }, [])
}
