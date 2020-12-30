import React from 'react'
import styled from 'styled-components'
import { string } from 'prop-types'

const Image = styled.img`
  /* box-shadow: 5px 2px 2px 3px rgba(0, 0, 0, 0.1); */
  margin: 20px;
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  border: ${(props) => `solid ${props.theme.text} 4px`};
  border-radius: 50%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`

export const Avatar = ({ src, size }) => (
  <span>
    <Image src={src} size={size} />
  </span>
)

Avatar.propTypes = {
  src: string.isRequired,
  size: string,
}

Avatar.defaultProps = {
  size: '150px',
}
