// Container Core
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

// Component Core
import React from 'react'

// /////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  componentWillReceiveProps(nextProps, prevProps) {
    if (!nextProps.auth.authToken || !nextProps.auth.user._id) {
      nextProps.dispatch(push('/login'))
    }
  },
  render() {
    const { children } = this.props
    return children
  },
})


// /////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ auth }) {
  return { auth }
}

function mapDispatchToProps(dispatch) {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component)
