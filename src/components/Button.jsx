import React from 'react'

export const Button = ({ children, onClick }) => {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
    </div>
  )
}
