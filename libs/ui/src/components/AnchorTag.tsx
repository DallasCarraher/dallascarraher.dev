import type { FC, ReactNode } from 'react';

export interface AnchorTagProps {
  href?: string;
  children: ReactNode;
  className?: string;
}

export const AnchorTag: FC<AnchorTagProps> = ({
  children,
  href = '#',
  className = '',
}) => {
  return (
    <a
      href={href}
      className={`hover:underline text-blue-500 transition-colors ${className}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
};
