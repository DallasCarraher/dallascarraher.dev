export default function setTheme() {
  return {
    __html: `<script>
      let dark = null
      const existingPreference = JSON.parse(localStorage.getItem('useDarkMode'))

      // if there's no pref, set one up based on system pref
      if (existingPreference === null) {
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ?
            (() => {
              dark = true;
              localStorage.setItem('useDarkMode', 'true')
            })()
          :
            (() => {
              dark = false;
              localStorage.setItem('useDarkMode', 'false')
            })()
      }
      else {
        existingPreference ? dark = true : dark = false;
      }

      // set the updated choice of dark mode
      localStorage.setItem('useDarkMode', dark.toString())
      const dataTheme = dark ? 'dark' : 'light'
      document.documentElement.setAttribute('data-reactroot', dataTheme)
    </script>`,
  }
}
