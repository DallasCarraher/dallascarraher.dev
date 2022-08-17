import { FC, ReactNode, CSSProperties } from 'react'

interface IAnchorTagProps {
  href?: string
  children: ReactNode
  styleOverride?: CSSProperties
}

export const AnchorTag: FC<IAnchorTagProps> = ({
  children,
  href = '#',
  styleOverride = {},
}) => {
  return (
    <a
      href={href}
      className="hover:underline text-blue-500"
      style={styleOverride}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}
