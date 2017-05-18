import React, { Component } from 'react'
import { connect } from 'react-redux'
import { passwordUpdate } from 'stemn-shared/misc/Auth/Auth.actions'
import PasswordSet from './PasswordSet'

const stateToProps = ({ auth }, { params }) => {
  return {
    auth,
  }
}

const dispatchToProps = {
  passwordUpdate,
}

@connect(stateToProps, dispatchToProps)
export default class PasswordSetContainer extends Component {
  render() {
    return (
      <PasswordSet {...this.props} />
    );
  }
}
