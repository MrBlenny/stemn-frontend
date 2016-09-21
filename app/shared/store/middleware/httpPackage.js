/***************************************************************************************************

This middleware is used to package http requests where possible.

It will transform multiple get requests into a single request of the form:
api/v1/entityType?ids[]=12345678901234567890?ids[]=12345678901234567890?ids[]=12345678901234567890

The action should contain a httpPackage object such as:

export function getTask({taskId}) {
  return {
    type: 'TASKS/GET_TASK',
    httpPackage: {
      endpoint: 'api/v1/tasks',                   The endpoint used to save it in the requests object
      url: `http://localhost:3000/api/v1/tasks`,  The Api endpoint
      method: 'GET',                              Http method, this should probably be GET
      params: {                                   Params object. This is what is packaged together.
        'ids[]' : taskId
      }
    }
  }
}

This middleware will emmit standard _PENDING, _FULFILLED and _REJECTED events
when the request has been fulfilled

***************************************************************************************************/

import i from 'icepick';
import http from 'axios';

const requests = {};        // This is where the packages are temporarily stored
const packageInterval = 20; // All items requested within 20ms will be packaged together
const suffixes = {
  pending   : '_PENDING',
  fulfilled : '_FULFILLED',
  rejected  : '_REJECTED'
}

export default store => next => action => {
  if(action.httpPackage){
    const { endpoint } = action.httpPackage;
    const dispatch     = store.dispatch;
    if(!requests[endpoint]){            // If the requests object does not exist:
      initRequest(action, dispatch)     // Initialise the requests object (start the package promise)
    }
    packageAction(action);              // Push the action onto the package array
    dispatchAction({action, dispatch, response: {}, suffix: suffixes.pending }); // Dispatch the _pending action
  }
  else{
    return next(action);
  }
};

////////////////////////////////////////////////////////////////////////////////////////////////

function initRequest(action, dispatch){
  requests[action.httpPackage.endpoint] = {
    request: setTimeout(()=>resolveRequest(action.httpPackage.endpoint, dispatch), packageInterval),
    actions: [],
  }
}
function resolveRequest(endpoint, dispatch){
  const samplePackage = requests[endpoint].actions[0].httpPackage; // Use the first item in the package as a sample for the url and method (this is pretty much always correct)
  const params = getParams(endpoint);         // Get the array of query params
  const actions = requests[endpoint].actions; // We assign actions here so we can delete it in the requests object without causing issues
  reset(endpoint);                            // Reset the endpoint so we can begin the next package
  http({                                      // Send the request
    url: samplePackage.url,
    method: samplePackage.method,
    params: params
  }).then( response => {
    dispatchActions({actions, dispatch, response, suffix: suffixes.fulfilled}) // Dispatch the fulfilled actions
  }).catch( response => {
    dispatchActions({actions, dispatch, response, suffix: suffixes.rejected})  // Dispatch the rejected actions
  })
}

function dispatchActions({actions, dispatch, response, suffix}){
  actions.forEach( (action, index) => {
    const newResponse = response && response.data && response.data[index] ? {
      data: response.data[index],
      request: response.request
    } : response;
    dispatchAction({action, dispatch, response: newResponse, suffix})   // Dispatch the action
  })
}

function dispatchAction({action, dispatch, response, suffix}){
  const modifiedSuffix = response && response.data && response.data.error ? suffixes.rejected : suffix; // If the response contains an error, we rejected it.
  const newAction = i.merge(action, {
    httpPackage: undefined,              // Delete the httpPackage key so we don't loop
    type: action.type + modifiedSuffix,  // Add the suffix to the action
    payload: response                    // Add the response to the payload
  });
  dispatch(newAction)                    // Dispatch the new action
}

function reset(endpoint){
  requests[endpoint] = undefined;
}

function packageAction(action){
  requests[action.httpPackage.endpoint].actions.push(action);
}

function getParams(endpoint){
  // This will get the all the httpPackage params associated with all the packages on a specific endpoint
  const samplePackage = requests[endpoint].actions[0].httpPackage;
  const paramKeys = Object.keys(samplePackage.params);
  const params = {};
  paramKeys.forEach((key)=>{
    params[key] = requests[endpoint].actions.map(action => action.httpPackage.params[key] )
  })
  return params
}
