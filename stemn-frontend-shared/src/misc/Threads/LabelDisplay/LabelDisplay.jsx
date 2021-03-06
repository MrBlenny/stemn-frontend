import React, { Component, PropTypes } from 'react'
import classes from './LabelDisplay.css'
import classNames from 'classnames'
import Link from 'stemn-shared/misc/Router/Link'

export default class LabelDisplay extends Component {
  static propTypes = {
    labels: PropTypes.array.isRequired,  // The labels
  }
  render() {
    const { labels } = this.props
    return (
      <div>
        { labels.map(label => (
          <div key={ label._id } className={ classNames(classes.row, 'layout-row layout-align-start-center') }>
            <div
              className={ classes.swatch }
              style={ { background: label.color } }
            />
            { label.name }
          </div>
        ))}
      </div>
    )
  }
}

