import React from 'react'
import styled from 'styled-components'
import { element, string, arrayOf, oneOfType } from 'prop-types'

const FlexContainer = styled.div`
  display: flex;
  flex-direction: ${(props) => props.direction};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  text-align: ${(props) => props.textAlign};
  flex-wrap: nowrap;
  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
  width: ${(props) => props.w};
  max-width: ${(props) => props.maxWidth};
  margin: ${(props) => props.m};
  padding: ${(props) => props.p};
`

export const Flex = (props) => <FlexContainer {...props} />

Flex.propTypes = {
  children: oneOfType([arrayOf(element), element]).isRequired,
  justifyContent: string,
  alignItems: string,
  textAlign: string,
  maxWidth: string,
  w: string,
  m: string,
  p: string,
}

Flex.defaultProps = {
  justifyContent: 'center',
  alignItems: 'left',
  textAlign: 'center',
  maxWidth: '100%',
  w: '100%',
  m: '10px',
  p: '10px',
}
