import React from 'react'
import styled from 'styled-components'
import { string, element, oneOfType, arrayOf } from 'prop-types'

const StyledCard = styled.div`
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  text-align: ${(props) => props.textAlign};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
  width: ${(props) => props.width};
  max-width: ${(props) => props.maxWidth || '100%'};
  border-radius: 10px;
  border: ${(props) => `solid ${props.theme.text} 3px`};
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 1px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
`

export const Card = (props) => {
  return (
    <StyledCard
      flexDirection={props.direction}
      alignItems={props.alignItems}
      textAlign={props.textAlign}
      margin={props.m}
      padding={props.p}
      width={props.width}
      maxWidth={props.maxWidth}
    >
      {props.children}
    </StyledCard>
  )
}

Card.propTypes = {
  children: oneOfType([arrayOf(element), element]),
  direction: string,
  alignItems: string,
  textAlign: string,
  m: string,
  p: string,
  width: string,
  maxWidth: string,
}

Card.defaultProps = {
  children: React.createElement('div'),
  direction: 'column',
  alignItems: 'center',
  textAlign: 'center',
  m: '10px',
  p: '10px',
  width: '100%',
  maxWidth: '100%',
}
