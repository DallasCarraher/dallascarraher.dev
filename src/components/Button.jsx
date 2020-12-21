import React from 'react'
import styled from 'styled-components'
import { func, element, string, bool } from 'prop-types'

const FONT_SIZE = {
  SMALL: '16px',
  MEDIUM: '24px',
  LARGE: '36px',
}

const getFontSize = (size) => {
  switch (size) {
    case 'small':
      return FONT_SIZE.SMALL
    case 'medium':
      return FONT_SIZE.MEDIUM
    case 'large':
      return FONT_SIZE.LARGE
    default:
      return FONT_SIZE.SMALL
  }
}

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
  children: element.isRequired,
  onClick: func.isRequired,
  size: string,
  disabled: bool,
}

Button.defaultProps = {
  size: 'small',
  disabled: false,
}
