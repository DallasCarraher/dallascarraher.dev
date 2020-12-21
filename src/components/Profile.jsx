import React from 'react'
import styled from 'styled-components'
import CodeIcon from '@material-ui/icons/Code'
import BusinessIcon from '@material-ui/icons/Business'
import LocationOnIcon from '@material-ui/icons/LocationOn'
import { Avatar } from './Avatar'
import { Card } from './Card'
import picture from 'img/avatar.jpg'

const codeIcon = <CodeIcon fontSize="small" className="sm-icons" />
const companyIcon = <BusinessIcon fontSize="small" className="sm-icons" />
const locationIcon = <LocationOnIcon fontSize="small" className="sm-icons" />

const MyName = styled.button`
  color: ${(props) => props.theme.text};
  font-size: 36px;
  border: none;
  background-color: transparent;
  outline: none;
  padding: 10px;
  user-select: none;
  :hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.07);
    border-radius: 5px;
  }
  :focus {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.07);
    border-radius: 5px;
  }
  :active {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
`

const InfoSection = styled.div`
  text-align: left;
  padding-bottom: 10px;
`

const InfoLine = styled.p`
  font-size: 16px;
`

export function Profile() {
  return (
    <Card margin="30px" width="350px">
      <Avatar src={picture} />
      <MyName>Dallas Carraher</MyName>
      <InfoSection>
        <InfoLine> {codeIcon} Front-end Engineer</InfoLine>
        <InfoLine> {companyIcon} CDK Global</InfoLine>
        <InfoLine> {locationIcon} Hillsboro, OR</InfoLine>
      </InfoSection>
    </Card>
  )
}
