import * as React from 'react'

export default function useDarkMode() {
  const [dark, setDark] = React.useState(false)
  const [initialized, setInitialized] = React.useState(false)

  React.useEffect(() => {
    const existingPreference = JSON.parse(
      localStorage.getItem('useDarkMode') as string
    ) as boolean

    // if there's no pref, set one up based on system pref
    // if (existingPreference === null) {
    //   window.matchMedia('(prefers-color-scheme: dark)').matches
    //     ? // user's system theme is dark
    //       (() => {
    //         setDark(true)
    //         localStorage.setItem('useDarkMode', 'true')
    //       })()
    //     : // user's system theme is light
    //       (() => {
    //         setDark(false)
    //         localStorage.setItem('useDarkMode', 'false')
    //       })()
    // }

    // if pref exists already and we're still initializing (i.e. first run), enforce it now
    if (!initialized) {
      existingPreference ? setDark(true) : setDark(false)
      setInitialized(true)
    }

    // set the updated choice of dark mode
    localStorage.setItem('useDarkMode', `${dark}`)
    const dataTheme = dark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-reactroot', dataTheme)
  }, [dark, initialized])

  return { dark, setDark }
}
