import { makeStyles } from '@material-ui/core/styles'
import { themes } from 'utils'

const { LIGHT } = themes
const drawerWidth = 200

export const useMobileStyles = (theme) => {
  return theme === LIGHT
    ? makeStyles((theme) => ({
        root: {
          display: 'flex',
        },
        appBar: {
          backgroundColor: '#074DCF',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
        appBarShift: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        hide: {
          display: 'none',
        },
        drawer: {
          width: drawerWidth,
          flexShrink: 0,
        },
        drawerPaper: {
          width: drawerWidth,
        },
        drawerHeader: {
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          // necessary for content to be below app bar
          ...theme.mixins.toolbar,
          justifyContent: 'flex-end',
        },
        modeToggleButton: {
          textDecoration: 'none',
          color: 'white',
          '&:hover': { color: '#4791db' },
        },
        content: {
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: -drawerWidth,
        },
        contentShift: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
        links: {
          textDecoration: 'none',
          color: 'gray',
          '&:hover': { color: 'black' },
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
    : makeStyles((theme) => ({
        root: {
          display: 'flex',
          height: '200vh',
        },
        appBar: {
          backgroundColor: '#074DCF',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        },
        appBarShift: {
          width: `calc(100% - ${drawerWidth}px)`,
          marginLeft: drawerWidth,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
        menuButton: {
          marginRight: theme.spacing(2),
        },
        hide: {
          display: 'none',
        },
        drawer: {
          width: drawerWidth,
          flexShrink: 0,
        },
        drawerPaper: {
          width: drawerWidth,
          backgroundColor: '#424242',
        },
        drawerHeader: {
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing(0, 1),
          // necessary for content to be below app bar
          ...theme.mixins.toolbar,
          justifyContent: 'flex-end',
        },
        modeToggleButton: {
          textDecoration: 'none',
          color: 'white',
          '&:hover': { color: '#4791db' },
        },
        content: {
          backgroundColor: '#303030',
          flexGrow: 1,
          padding: theme.spacing(3),
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          marginLeft: -drawerWidth,
        },
        contentShift: {
          transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
          }),
          marginLeft: 0,
        },
        links: {
          textDecoration: 'none',
          color: 'gray',
          '&:hover': { color: 'black' },
        },
        icons: {
          color: 'white',
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
}
