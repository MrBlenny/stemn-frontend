import React, { Component } from 'react'

import classNames from 'classnames'
import classes from './ProjectSettings.css'

import NavPill from 'stemn-shared/misc/Buttons/NavPill/NavPill'
import NavPillContainer from 'stemn-shared/misc/Buttons/NavPillContainer'
import { Row, Col, Container } from 'stemn-shared/misc/Layout'

export default class ProjectSettings extends Component {
  render() {
    const { children, project } = this.props
    const baseUrl = `/project/${project.data._id}/settings`
    return (
      <div className={ classes.content }>
        <Container>
          <Row className="layout-xs-column layout-gt-xs-row">
            <Col className="flex-gt-xs-30">
              <NavPillContainer>
                <NavPill to={ baseUrl } onlyActiveOnIndex>General</NavPill>
                <NavPill to={ `${baseUrl}/permissions` }>Permissions</NavPill>
                <NavPill to={ `${baseUrl}/tags` }>Tags</NavPill>
                <NavPill to={ `${baseUrl}/threads` }>Threads</NavPill>
                <NavPill to={ `${baseUrl}/team` }>Team</NavPill>
              </NavPillContainer>
            </Col>
            <Col className="flex">
              { children }
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

