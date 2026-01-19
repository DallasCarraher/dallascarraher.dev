import type { FC, ReactNode, CSSProperties } from 'react';

export interface AnchorTagProps {
  href?: string;
  children: ReactNode;
  styleOverride?: CSSProperties;
}

export const AnchorTag: FC<AnchorTagProps> = ({
  children,
  href = '#',
  styleOverride = {},
}) => {
  return (
    <a
      href={href}
      className="hover:underline text-blue-500 transition-colors"
      style={styleOverride}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};
