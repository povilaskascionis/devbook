import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';

import { GET_ERRORS, SET_CURRENT_USER } from './types';

//Register user
export const registerUser = (userData, history) => dispatch => {
  // pass history object from component props
  axios
    .post('/api/userAuth/register', userData)
    .then(res => history.push('/login')) // redirect to login page
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login user - get user token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/userAuth/login', userData)
    .then(res => {
      //save token to local storage
      const { token } = res.data;
      localStorage.setItem('jwtToken', token);
      // set token to the auth header
      setAuthToken(token);
      //decode token to extract user data
      const decoded = jwtDecode(token);
      //set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

export const logoutUser = () => dispatch => {
  // remove token from local storage
  localStorage.removeItem('jwtToken');
  // remove auth header for
  setAuthToken(false);
  // set isAuthenticated to false and current user to {}
  dispatch(setCurrentUser({}));
};
