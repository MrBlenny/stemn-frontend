// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ProjectsActions from 'stemn-shared/misc/Projects/Projects.actions.js';
import * as TasksActions    from 'stemn-shared/misc/Tasks/Tasks.actions.js';

// Component Core
import React, { PropTypes } from 'react';
import { has } from 'lodash';

// Styles
import classNames from 'classnames';
import classes from '../ProjectSettingsPage.css'

// Sub Components

import TasksSettings from 'stemn-shared/misc/ProjectSettings/TasksSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

///////////////////////////////// COMPONENT /////////////////////////////////

export const Component = React.createClass({
  onMount(nextProps, prevProps){
    if(!prevProps || nextProps.projectId !== prevProps.projectId){
      nextProps.tasksActions.getBoards({
        projectId: nextProps.projectId
      })
    }
  },
  componentWillMount() { this.onMount(this.props) },
  componentWillReceiveProps(nextProps) { this.onMount(nextProps, this.props)},
  render() {
    const { boardModel, board, dispatch, tasksActions } = this.props;
    return (
      <div>
       <InfoPanel>
         <TasksSettings
           boardModel={ boardModel }
           board={ board }
           dispatch={ dispatch }
           updateBoard={ tasksActions.updateBoard }
         />
       </InfoPanel>
      </div>
    )
  }
});

///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({tasks, projects}, {params}) {
  const projectId = params.stub;
  const projectBoards = tasks.projects && tasks.projects[projectId] ? tasks.projects[projectId].boards : null;
  const board = projectBoards ? tasks.boards[projectBoards[0]] : {};
  const boardModel = projectBoards ? `tasks.boards.${projectBoards[0]}` : '';
  return {
    projectId,
    board,
    boardModel,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    tasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
