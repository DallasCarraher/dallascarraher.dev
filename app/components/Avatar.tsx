import { css } from '@emotion/css'
import picture from '~/assets/avatar.jpg'

export default function Avatar() {
  return (
    <img
      src={picture}
      className={css`
        margin: 20px;
        height: 200px;
        border: solid 4px;
        border-radius: 50%;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
        -ms-user-select: none;
      `}
    />
  )
}
