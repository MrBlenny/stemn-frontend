import React, { Component } from 'react'
import { connect } from 'react-redux'
import Explore from './Explore'

const stateToProps = () => ({
});

const dispatchToProps = {
};

@connect(stateToProps, dispatchToProps)
export default class ExploreContainer extends Component {
  render() {
    return (
      <Explore {...this.props} />
    )
  }
}
