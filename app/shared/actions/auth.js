import http from 'axios';
import { push } from 'react-router-redux'
import {ipcRenderer} from 'electron';

export const aliases = {};

export function loadUserData() {
  return {
      type:'ALIASED',
      payload: {},
      meta: {
        trigger: 'AUTH/LOAD_USER_DATA',
      },
  }
}

aliases['AUTH/LOAD_USER_DATA'] = function loadUserDataAlias(args) {
  return {
    type:'AUTH/LOAD_USER_DATA',
    http: true,
    payload: {
      url: 'https://stemn.com/api/v1/me',
      method: 'GET',
    }
  }
};

export function setAuthToken(token) {
  return {
      type:'AUTH/SET_AUTH_TOKEN',
      payload: token
  }
}

export function removeAuthToken() {
  return {
      type:'AUTH/REMOVE_AUTH_TOKEN',
  }
}

export function initHttpHeaders(fullToken) {
  http.defaults.headers.common['Authorization'] = fullToken;
  return {
      type:'AUTH/INIT_HTTP_HEADER',
  }
}

export function removeHttpHeaders() {
  delete http.defaults.headers.common['Authorization'];
  return {
      type:'AUTH/REMOVE_HTTP_HEADER',
  }
}

export function clearUserData() {
  return {
      type:'AUTH/CLEAR_USER_DATA',
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(clearUserData());
    dispatch(removeHttpHeaders());
    dispatch(removeAuthToken());
    setTimeout(()=>{dispatch(push('/login'))}, 1)
    dispatch({
        type:'AUTH/LOGOUT',
    })
  }
}