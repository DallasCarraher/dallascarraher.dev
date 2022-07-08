import { hydrate } from 'react-dom'
import { RemixBrowser } from 'remix'
import addOverrides from '~/prototype-overrides'

addOverrides()
hydrate(<RemixBrowser />, document)
