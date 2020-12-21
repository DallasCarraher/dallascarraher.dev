import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { Button } from './Button'
import { Anchor } from './Anchor'
import { ThemeIconButton } from './ThemeIconButton'

const StyledHeader = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 20px;
  margin: 30px;
  align-items: center;
  border-radius: 10px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 1px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
`

export const Nav = () => {
  return (
    <StyledHeader>
      <Link to="/">
        <Button size="medium">Home</Button>
      </Link>
      <Link to="/resumé">
        <Button size="medium" disabled>
          Resumé
        </Button>
      </Link>
      <Button size="medium">
        <Anchor url="https://github.com/dallascarraher" text="Github" />
      </Button>
      <Button size="medium">
        <Anchor url="https://linkedin.com/in/dallascarraher/" text="LinkedIn" />
      </Button>
      <ThemeIconButton />
    </StyledHeader>
  )
}
