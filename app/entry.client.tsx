import { hydrate } from 'react-dom'
import { RemixBrowser } from 'remix'
import useTheme from '~/hooks/useTheme'

hydrate(<RemixBrowser />, document)

// useTheme()
