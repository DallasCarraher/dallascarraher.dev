import React from 'react'
import styled from 'styled-components'
import { Flex } from './Flex'
import { Profile } from './Profile'
import { Nav } from './Nav'
import { Card } from './Card'
import useCheckForMobile from './useCheckForMobile'

const Announcement = styled.h1`
  user-select: none;
`

const Divider = styled.div`
  border-left: ${(props) => `solid ${props.theme.text} 5px`};
  border-radius: 20px;
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
        <Flex direction="column" alignItems="center" m="30px">
          <Card margin="30px" maxWidth="800px">
            <Announcement>Still working on my site 👍</Announcement>
            <Announcement>Thanks for taking a peek though!</Announcement>
          </Card>
        </Flex>
      </Flex>
    </>
  )
}
