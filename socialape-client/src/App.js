import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import './App.css';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import jwtDecode from 'jwt-decode'

import themeFile from './util/theme'
import Navbar from './components/layout/Navbar';
import AuthRoute from './util/AuthRoute'
import { Provider } from 'react-redux'
import store  from './redux/store'
import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions'

import home from './pages/home'
import login from './pages/login'
import signup from './pages/signup'
import user from './pages/user'

import axios from 'axios';
axios.defaults.baseurl = "https://us-central1-social-media-app-2-9a691.cloudfunctions.net/api";

const theme = createMuiTheme(themeFile);

const token = localStorage.FBIdToken;
if(token){
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser());
    window.location.href = '/login'
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component{
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <div className="App">
            <Router>
              <div className="container">
                <Navbar/>
                <Switch>
                  <Route exact path="/" component={home}/>
                  <AuthRoute exact path="/login" component={login}/>
                  <AuthRoute exact path="/signup" component={signup}/>
                  <Route exact path="/user/:handle" component={user}/>
                  <Route exact path="/user/:handle/screams/:screamId" component={user}/>
                </Switch>
                </div>
            </Router>
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
