import React from 'react'
import styled from 'styled-components'
import { string } from 'prop-types'

const Image = styled.img`
  box-shadow: 5px 2px 2px 3px rgba(0, 0, 0, 0.1);
  margin: 10px;
  height: 200px;
  width: 200px;
  border-radius: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  -ms-user-select: none;
`

export const Avatar = ({ src }) => (
  <span>
    <Image src={src} />
  </span>
)

Avatar.propTypes = {
  src: string.isRequired,
}
