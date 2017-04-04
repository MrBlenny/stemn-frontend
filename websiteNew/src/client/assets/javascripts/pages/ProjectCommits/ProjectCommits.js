import React, { Component } from 'react';

import classNames from 'classnames';
import classes from './ProjectCommits.css'

import moment from 'moment';
import { groupBy, values } from 'lodash';

import { Container } from 'stemn-shared/misc/Layout';
import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar';
import { Link } from 'react-router';
import LoadingOverlay from 'stemn-shared/misc/Loading/LoadingOverlay/LoadingOverlay.jsx';

const groupByDay = (data) => {
  const groupedObject = groupBy(data, (item) => moment(item.timestamp).format('YY/MM/DD'));
  const groupedArray = Object.keys(groupedObject).map((key) => {
    return {
      date: key,
      items: groupedObject[key]
    }
  });
  return groupedArray;
}


export default class ProjectCommits extends Component {
  renderLoaded() {
    const { project, syncTimeline } = this.props;
    const baseUrl = `/project/${project.data._id}`;
    
    const groupedCommits = groupByDay(syncTimeline.data);
    console.log(groupedCommits);
    
    const getCalendarText = (time) => (moment(time).calendar().split(' at'))[0];

    return (
      <div>
        <Container>
          { groupedCommits.map((group) => (
            <div>
              <div className='text-mini-caps'>Commits: { getCalendarText(group.items[0].timestamp) }</div>
              <div className={ classes.commitPanel }>
                { group.items.map((commit) => (
                  <div className={ classes.commit } key={ commit._id }>
                    <Link to={`/users/${commit.user._id}`}>
                      <UserAvatar
                        className={ classes.avatar }
                        name={ commit.user.name }
                        picture={ commit.user.picture }
                        size={ 40 }
                        shape='square'
                      />
                    </Link>
                    <div>
                      <Link className={ classes.summary } to={`${baseUrl}/commits/${commit._id}`}>
                        { commit.data.summary }
                      </Link>
                      <div className={ classes.meta }>
                        <Link to={`/users/${commit.user._id}`}>{ commit.user.name }</Link>
                        &nbsp;commited { moment(commit.timestamp).fromNow() }.
                      </div>
                    </div>
                  </div>
                )) }
              </div>
            </div>
          )) }

        </Container>
      </div>
    )
  }
  
  render() {
    const { project, syncTimeline } = this.props;
    const isLoaded = syncTimeline && syncTimeline.data;
    
    return (
      <div className={ classes.content }>
        <LoadingOverlay show={ !isLoaded } hideBg/>
        { isLoaded
        ? this.renderLoaded()
        : null }
      </div>
    )
      
  }
};