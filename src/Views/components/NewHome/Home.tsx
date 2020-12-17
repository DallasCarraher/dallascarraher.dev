import React from 'react';
import { Button } from 'components/Button';

export function NewHome({ toggleTheme }) {
  return (
    <div>
      <Button onClick={toggleTheme}>Toggle theme</Button>
    </div>
  );
}

export interface HomeProps {
  /**
   * function to toggle the theme
   */
  toggleTheme: () => void;
}
