import React from 'react'
import styled from 'styled-components'
import { ThemeIconButton } from 'components/ThemeIconButton'

const FlexContainer = styled.header`
  display: flex;
  flex-direction: start;
  justify-content: flex-start;
  border-bottom: solid 2px ${(props) => props.theme.text};
`

const MyName = styled.h1`
  margin-left: 10px;
  margin-right: 10px;
  padding: 10px;
  user-select: none;
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.07);
    border-radius: 5px;
  }
  :active {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
`

export function Header() {
  return (
    <FlexContainer>
      <MyName>Dallas Carraher</MyName>
      <ThemeIconButton />
    </FlexContainer>
  )
}
