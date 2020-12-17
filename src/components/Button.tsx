import React from 'react'

export const Button: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
    </div>
  )
}

export interface ButtonProps {
  /**
   * function to toggle the theme
   */
  toggleTheme: () => void
  /**
   * function to run on-click of the button
   */
  onClick: () => void
}
