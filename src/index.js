import React from 'react';

import {
  Router,
  nativeHistory
} from 'react-router-native';

import {ThemeProvider} from 'react-native-material-ui';

import routes from './components/routes';
import uiTheme from './theme';


export default () =>
    <ThemeProvider uiTheme={uiTheme}>
    	<Router history={nativeHistory}>
    		{routes}
    	</Router>
    </ThemeProvider>