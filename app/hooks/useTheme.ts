/**
 * makes a root element attribute mutation to change the root css values
 * @param pref
 */
function useDark(pref: boolean) {
  const dataTheme = pref ? 'dark' : ''
  document.documentElement.setAttribute('data-theme', dataTheme)
}

export default function useTheme() {
  const existingPreference = localStorage.getItem('theme') as
    | 'light'
    | 'dark'
    | undefined
  console.log(existingPreference)

  if (existingPreference === 'light') {
    useDark(false)
  }
  // if the user has no preference, use matchMedia or default to dark
  else {
    window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? useDark(true)
        : useDark(false)
      : useDark(true)
  }
}
