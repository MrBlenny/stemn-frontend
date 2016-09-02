// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as TasksActions from 'app/renderer/main/modules/Tasks/Tasks.actions.js';

// Component Core
import React from 'react';

import u from 'updeep';

// Styles
import classNames from 'classnames';

// Sub Components
import LoadingOverlay from 'app/renderer/main/components/Loading/LoadingOverlay/LoadingOverlay.jsx';
import TaskList       from 'app/renderer/main/modules/Tasks/TaskList/TaskList.jsx'
import TaskGrid       from 'app/renderer/main/modules/Tasks/TaskGrid/TaskGrid.jsx'


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

export const Component = React.createClass({

  componentWillMount() {
    if(this.props.project){
      this.props.TasksActions.getTasks({
        projectId: this.props.project._id
      })
    }
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.project && nextProps.project._id !== this.props.project._id) {
      this.props.TasksActions.getTasks({
        projectId: nextProps.project._id
      })
    }
  },

  render() {
    const { tasks, project, TasksActions, entityModel } = this.props;
    if(tasks && tasks.items){
      return (
        <div className="layout-row flex">
          <TaskGrid project={project}
            tasks={tasks}
            TasksActions={TasksActions}>
          </TaskGrid>
        </div>
      )
    }
    else{
      return <LoadingOverlay />
    }
  }
});


/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps({tasks, projects}, {params}) {
  const project = projects[params.stub];
  return {
    project: project,
    tasks: tasks[params.stub],
    entityModel: `projects.${params.stub}`
  };
}


function mapDispatchToProps(dispatch) {
  return {
    TasksActions: bindActionCreators(TasksActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);