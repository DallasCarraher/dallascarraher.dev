import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { Button } from './Button'
import { Anchor } from './Anchor'
import { ThemeIconButton } from './ThemeIconButton'

const StyledNav = styled.nav`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  flex-wrap: wrap;
  padding: 10px;
  margin: 0px;
  align-items: center;
`

export const Nav = () => {
  return (
    <StyledNav>
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
    </StyledNav>
  )
}
