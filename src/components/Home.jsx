import React from 'react'
import styled from 'styled-components'
// import { Flex } from './Flex'
import { Profile } from './Profile'
import { Nav } from './Nav'
import { Card } from './Card'

const Layout = styled.section`
  display: ${(props) => props.display || 'flex'};
  flex-direction: ${(props) => props.flexDirection};
  flex-wrap: nowrap;
  @media (max-width: 960px) {
    flex-wrap: wrap;
  }
  align-items: ${(props) => props.alignItems || 'left'};
  text-align: ${(props) => props.textAlign || 'center'};
  justify-content: ${(props) => props.justifyContent || 'center'};
  width: ${(props) => props.width || '100%'};
  padding: ${(props) => props.padding || '10px'};
`

const Announcement = styled.h1`
  user-select: none;
  text-align: center;
`

export function Home() {
  return (
    <Layout flexDirection="column">
      <Layout flexDirection="column" alignItems="center">
        <Nav />
      </Layout>
      <Layout>
        <Profile />
        <Card margin="30px" maxWidth="800px">
          <Announcement>
            Re-writing my site right now, please bear with 😅
          </Announcement>
        </Card>
      </Layout>
    </Layout>
  )
}
