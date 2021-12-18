import React from 'react'
import styled from 'styled-components'
import { element, oneOfType, arrayOf } from 'prop-types'

const GridContainer = styled.section`
  display: grid;
  grid-template-columns: ${(props) =>
    props.columns || '1fr min(65ch, calc(100% - 10em)) 1fr'};
  grid-gap: 5em;
  & > * {
    grid-column: 2;
  }
  & > .full-bleed {
    width: 100%;
    grid-column: 1/4;
  }
`

export const Grid = (props) => <GridContainer {...props} />

Grid.propTypes = {
  children: oneOfType([arrayOf(element), element]).isRequired,
}
