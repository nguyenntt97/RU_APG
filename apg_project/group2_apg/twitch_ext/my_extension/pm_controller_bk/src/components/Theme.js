import * as React from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const MyTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
    },
  });

export default MyTheme;