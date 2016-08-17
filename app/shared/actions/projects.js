import http from 'axios';
export const GET_PROJECT = 'PROJECTS/GET_PROJECT';

export function getProject({stub}) {
  return {
    type: GET_PROJECT,
    payload: http({
      method: 'GET',
      url: `https://stemn.com/api/v1/projects/${stub}`
    })
  };
}

export function addTeamMember({stub, user}) {
  return {
    type: 'PROJECTS/ADD_TEAM_MEMBER',
    payload: {
      stub,
      user
    }
  };
}
