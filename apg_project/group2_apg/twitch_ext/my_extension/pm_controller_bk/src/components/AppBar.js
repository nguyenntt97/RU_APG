import * as React from 'react';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@emotion/react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useNavigate,
  useLocation
} from "react-router-dom";

import MyTheme from './Theme';

export default function MyAppBar(props) {
  let loggedIn = props.loggedIn
  let username = props.username

  return (
    <ThemeProvider theme={MyTheme}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="div" sx={{ flexGrow: 1 }} />
            {loggedIn ?
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>username</Typography> :
              <Button color="inherit">Login</Button>
            }
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}
