import http from 'axios'

export const addLines = ({ lines, stepId }) => ({
  type: 'TERMINAL/ADD_LINES',
  payload: {
    lines,
  },
  meta: {
    stepId,
  },
})
  
export const getLines = ({ pipelineId, stepId }) => ({
  type: 'TERMINAL/GET_LINES',
  payload: http({
    method: 'GET',
    url: `/api/v1/pipelines/${pipelineId}/steps/${stepId}/logs`,
  }),
  meta: {
    stepId,
  },
})
  