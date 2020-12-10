import { makeStyles } from '@material-ui/core/styles'
import { themes } from 'utils'

const { LIGHT } = themes
const drawerWidth = 240

export const useStyles = (theme) =>
  theme === LIGHT
    ? makeStyles((theme) => ({
        root: {
          display: 'flex',
        },
        appBar: {
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#074DCF',
          display: 'flex',
        },
        drawer: {
          width: drawerWidth,
          flexShrink: 0,
        },
        drawerPaper: {
          width: drawerWidth,
        },
        drawerContainer: {
          overflow: 'auto',
        },
        modeToggleButton: {
          textDecoration: 'none',
          color: 'white',
          '&:hover': { color: '#303030' },
        },
        links: {
          textDecoration: 'none',
          color: 'gray',
          '&:hover': { color: '#303030' },
        },
        content: {
          flexGrow: 1,
          padding: theme.spacing(3),
        },
        myName: {
          textTransform: 'none',
          fontFamily: 'Operator Mono',
          color: 'white',
          marginBottom: '0.5rem',
          marginLeft: '1rem',
          flexGrow: 1,
        },
        nameLogo: {
          textDecoration: 'none',
          marginLeft: '1rem',
          flexGrow: 1,
        },
      }))
    : // Dark Mode
      makeStyles((theme) => ({
        root: {
          display: 'flex',
          height: '100vh',
        },
        appBar: {
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: '#074DCF',
          display: 'flex',
        },
        drawer: {
          width: drawerWidth,
          flexShrink: 0,
        },
        drawerPaper: {
          width: drawerWidth,
          backgroundColor: '#424242',
        },
        drawerContainer: {
          overflow: 'auto',
        },
        modeToggleButton: {
          textDecoration: 'none',
          color: 'white',
          '&:hover': { color: '#4791db' },
        },
        links: {
          textDecoration: 'none',
          color: 'gray',
          '&:hover': { color: 'white' },
        },
        icons: {
          color: 'white',
        },
        content: {
          flexGrow: 1,
          padding: theme.spacing(3),
          backgroundColor: '#303030',
          height: '100%',
        },
        myName: {
          textTransform: 'none',
          fontFamily: 'Operator Mono',
          color: 'white',
          marginBottom: '0.5rem',
          marginLeft: '1rem',
          flexGrow: 1,
        },
        nameLogo: {
          textDecoration: 'none',
          marginLeft: '1rem',
          flexGrow: 1,
        },
      }))

export default useStyles
