const FONT_SIZE = {
  SMALL: '16px',
  MEDIUM: '24px',
  LARGE: '36px',
}

export default function getFontSize(size) {
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
