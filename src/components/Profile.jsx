import React from 'react'
import styled from 'styled-components'
import CodeIcon from '@material-ui/icons/Code'
import BusinessIcon from '@material-ui/icons/Business'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import { Flex } from './Flex'
import { Avatar } from './Avatar'
import { Card } from './Card'
import picture from 'img/avatar.jpg'
import getFontSize from 'utils/getFontSize'

const codeIcon = <CodeIcon fontSize="small" className="sm-icons" />
const companyIcon = <BusinessIcon fontSize="small" className="sm-icons" />
const locationIcon = <LocationOnIcon fontSize="small" className="sm-icons" />

const MyName = styled.button`
  color: ${(props) => props.theme.text};
  font-size: ${({ size }) => getFontSize(size)};
  padding: 10px;
  border: none;
  background-color: transparent;
  outline: none;
  user-select: none;
`

const InfoSection = styled.div`
  text-align: left;
  padding-left: 30px;
  padding-bottom: 10px;
`

const InfoLine = styled.p`
  font-size: 20px;
`

export const Profile = () => (
  <>
    <Card direction="column" p="10px" maxWidth="300px">
      <Avatar src={picture} size="200px" />
      <Flex direction="column">
        <MyName size="medium">Dallas Carraher</MyName>
        <InfoSection>
          <InfoLine> {codeIcon} Front-end Engineer</InfoLine>
          <InfoLine> {companyIcon} CDK Global</InfoLine>
          <InfoLine> {locationIcon} Hillsboro, OR</InfoLine>
        </InfoSection>
      </Flex>
    </Card>
  </>
)
