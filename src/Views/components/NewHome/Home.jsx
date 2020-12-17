import React from 'react'
import { Button } from 'components/Button'

export function NewHome({ toggleTheme }) {
  return (
    <div>
      <Button onClick={toggleTheme}>Toggle theme</Button>
    </div>
  )
}
