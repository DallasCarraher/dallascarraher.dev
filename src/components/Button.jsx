import React from 'react'
import styled from 'styled-components'
import { func, string, bool, any } from 'prop-types'
import getFontSize from 'utils/getFontSize'

const StyledButton = styled.button`
  color: ${(props) => props.theme.text};
  text-decoration: ${(props) => (props.disabled && 'line-through') || 'none'};
  font-size: ${({ size }) => getFontSize(size)};
  border: none;
  background-color: transparent;
  outline: none;
  padding: 10px;
  margin: ${(props) => props.margin || '10px'};
  user-select: none;
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.07);
    border-radius: 5px;
  }
  :focus {
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

export const Button = ({ children, onClick, size, disabled }) => {
  return (
    <div>
      <StyledButton onClick={onClick} size={size} disabled={disabled}>
        {children}
      </StyledButton>
    </div>
  )
}

Button.propTypes = {
  children: any.isRequired,
  onClick: func,
  size: string,
  disabled: bool,
}

Button.defaultProps = {
  onClick: () => {},
  size: 'small',
  disabled: false,
}
