import React from 'react'
import styled from 'styled-components'
import { string, bool } from 'prop-types'

const StyledAnchor = styled.a`
  color: ${(props) => props.theme.text};
  text-decoration: ${(props) => (props.disabled && 'line-through') || 'none'};
  pointer-events: ${(props) => props.disabled && 'none'};
`

export const Anchor = ({ text, url, disabled }) => (
  <StyledAnchor
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    disabled={disabled}
  >
    {text}
  </StyledAnchor>
)

Anchor.propTypes = {
  text: string,
  url: string,
  disabled: bool,
}

Anchor.defaultProps = {
  text: '',
  url: '',
  disabled: false,
}
