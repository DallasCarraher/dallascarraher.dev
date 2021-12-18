import React from 'react'
import styled from 'styled-components'
import { Flex } from './Flex'
import { Profile } from './Profile'
import { Nav } from './Nav'
import { Card } from './Card'
import useCheckForMobile from './useCheckForMobile'

const Divider = styled.div`
  border-left: ${(props) => `solid ${props.theme.text} 5px`};
  border-radius: 20px;
`

const ListItem = styled.li`
  font-size: 20px;
  margin: 8px;
  @media (max-width: 960px) {
    font-size: 16px;
  }
`

export function Home() {
  return (
    <>
      <Flex alignItems="center">
        <Nav />
      </Flex>
      <Flex>
        <Flex
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          maxWidth="500px"
        >
          <Profile />
        </Flex>
        {useCheckForMobile() > 960 && (
          <Flex direction="row" justifyContent="flex-start" w="10%">
            <Divider />
          </Flex>
        )}
        <Flex direction="column" alignItems="center" m="30px" maxWidth="600px">
          <Card
            margin="30px"
            maxWidth="500px"
            alignItems="center"
            textAlign="left"
          >
            <h2 style={{ padding: 10, margin: 0 }}>
              Front-end Software Engineer
            </h2>
            <ul>
              <ListItem>
                ECMAScript 6, Typescript, React, React Native{' '}
              </ListItem>
              <ListItem>Node, Express, & some GraphQL </ListItem>
              <ListItem>
                AWS (DynamoDB, RDS) & Google Cloud equivalents.
              </ListItem>
              <ListItem>
                BS in Information Systems from Oregon State University
              </ListItem>
            </ul>
          </Card>
        </Flex>
      </Flex>
    </>
  )
}
