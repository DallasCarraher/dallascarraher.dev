import React from 'react'
import styled from 'styled-components'
import { Header } from './Header'

const Announcement = styled.h1`
  user-select: none;
  margin-top: 200px;
  text-align: center;
`

export function Home() {
  return (
    <>
      <Header />
      <section>
        <Announcement>
          Re-writing my site right now, please bear with 😅
        </Announcement>
      </section>
    </>
  )
}
