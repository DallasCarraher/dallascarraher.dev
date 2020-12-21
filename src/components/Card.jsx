import React from 'react'
import styled from 'styled-components'
import { string, element } from 'prop-types'

const StyledCard = styled.div`
  display: flex;
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  margin: ${(props) => props.margin};
  width: ${(props) => props.width};
  border-radius: 10px;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048), 0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072), 0 1px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12);
`

export const Card = (props) => {
  return (
    <StyledCard
      flexDirection={props.flexDirection}
      alignItems={props.alignItems}
      margin={props.margin}
      width={props.width}
    >
      {props.children}
    </StyledCard>
  )
}

Card.propTypes = {
  children: element,
  flexDirection: string,
  alignItems: string,
  margin: string,
  width: string,
  // minWidth: string,
}

Card.defaultProps = {
  children: React.createElement('div'),
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0px',
  width: '100%',
}
