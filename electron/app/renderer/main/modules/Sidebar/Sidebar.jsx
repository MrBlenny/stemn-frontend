// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as SidebarActions from 'electron/app/shared/actions/sidebar';
import * as AuthActions from 'electron/app/shared/modules/Auth/Auth.actions.js';
import * as ProjectsActions from 'electron/app/shared/actions/projects';
import * as ModalActions from 'electron/app/renderer/main/modules/Modal/Modal.actions.js';
import * as SystemActions from 'electron/app/shared/modules/System/System.actions.js';

// Component Core
import React from 'react';
import { escapeRegExp, orderBy } from 'lodash';

// Styles
import classNames from 'classnames';
import styles from './Sidebar.css';
import userStyles from './SidebarAvatar.css';

// Sub Components
import DragResize      from 'electron/app/renderer/main/modules/DragResize/DragResize.jsx';
import { Link } from 'react-router';
import { ContextMenuLayer } from "react-contextmenu";
import PopoverMenu from 'electron/app/renderer/main/components/PopoverMenu/PopoverMenu';
import Input from 'electron/app/renderer/main/components/Input/Input/Input'
import ContextMenu from 'electron/app/renderer/main/modules/ContextMenu/ContextMenu.jsx';
import SidebarProjectButton from './SidebarProjectButton.jsx';
import SimpleIconButton from 'electron/app/renderer/main/components/Buttons/SimpleIconButton/SimpleIconButton.jsx';
import MdMenu from 'react-icons/md/menu';
import MdSearch from 'react-icons/md/search';
import MdSettings from 'react-icons/md/settings';
import MdAdd from 'react-icons/md/add';
import ProjectMenu from 'electron/app/renderer/main/modules/Projects/Project.menu.js';

import UserAvatar          from 'electron/app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';

///////////////////////////////// COMPONENT /////////////////////////////////
const projectContextIdentifier = 'ProjectContextIdentifier';
const ProjectWithContext = ContextMenuLayer(projectContextIdentifier, (props) => props.item)(SidebarProjectButton);

export const Component = React.createClass({
  showProjectNewModal(){
    this.props.modalActions.showModal({modalType: 'PROJECT_NEW',})
  },
  render() {
    const { projectsActions, projects, auth, dispatch } = this.props;
    const sidebarStyle = classNames('layout-column', 'flex' ,'rel-box', styles.sidebar);
    const nameRegex = new RegExp(escapeRegExp(this.props.sidebar.searchString), 'i');
    const filteredProjects = projects.userProjects.data ? projects.userProjects.data.filter(project => nameRegex.test(project.name)) : [];
    const filteredProjectsOrdered = orderBy(filteredProjects, 'updated', 'desc')

    return (
      <DragResize side="right" width="300" widthRange={[0, 500]} animateHide={!this.props.sidebar.show} className="layout-column flex scroll-dark">
        <div className={sidebarStyle}>
          <div className={styles.sidebarToolbar + ' layout-row layout-align-start-center'}>
            <SimpleIconButton className={styles.sideBarIcon} title="Create new project" onClick={this.showProjectNewModal}>
              <MdAdd size="25"/>
            </SimpleIconButton>
            <div className="flex" />
            <SimpleIconButton title="Toggle sidebar" className={styles.sideBarIcon} onClick={()=>{this.props.sidebarActions.toggleSidebar();}}>
              <MdMenu size="25"/>
            </SimpleIconButton>
          </div>
          <div className="layout-column flex">
            <div className={styles.sidebarSearch}>
              <Input model="sidebar.searchString" value={this.props.sidebar.searchString} className="dr-input text-ellipsis" type="text" placeholder="Search all projects"/>
              <MdSearch className={styles.sidebarSearchIcon} size="25"/>
            </div>
            <div className="scroll-box flex">
              {projects.userProjects.data && projects.userProjects.data.length == 0 ? <SidebarProjectButton  item={{name: 'Create a project'}} clickFn={this.showProjectNewModal} /> : null }
              {filteredProjectsOrdered.length > 0 ? <div style={{padding: '10px 15px 5px', opacity: '0.7'}}>My Projects</div> : null}
              {filteredProjectsOrdered.map((item, idx) => <ProjectWithContext key={item._id} item={item} isActive={item._id == this.props.params.stub} to={`/project/${item._id}`}/>)}
              <ContextMenu identifier={projectContextIdentifier} menu={ProjectMenu(dispatch)}/>
            </div>
          </div>
          <div>
            <div className={styles.footer + ' layout-row layout-align-start-center'}>
              <PopoverMenu>
                <a className="flex">
                  <div className={userStyles.userWrapper + ' flex layout-row layout-align-start-center'}>
                    <UserAvatar picture={this.props.auth.user.picture} name={this.props.auth.user.name} className={userStyles.userAvatar}/>
                    <div className="flex text-ellipsis">
                      {this.props.auth.user.name}
                    </div>
                  </div>
                </a>
                <div className="PopoverMenu">
                  <a href="#/settings/application">Application Settings</a>
                  <a href="#/settings/account">Account Settings</a>
                  <a onClick={()=>{this.props.authActions.logout()}}>Sign out</a>
                </div>
              </PopoverMenu>
              <Link className={userStyles.userSettings + ' layout-column layout-align-center-center'} to="/settings/application"><MdSettings size="25"/></Link>
            </div>
          </div>
        </div>
      </DragResize>

    );
  }
});

//              <div className="text-grey-3" style={{padding: '10px 15px 5px'}}>Other Projects</div>
//              <SidebarProjectButton  item={{name: 'Demo Project'}} icon="tutorial" />


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps({ sidebar, auth, projects }, {params}) {
  return {
    sidebar,
    auth,
    params,
    projects,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    authActions: bindActionCreators(AuthActions, dispatch),
    sidebarActions: bindActionCreators(SidebarActions, dispatch),
    projectsActions: bindActionCreators(ProjectsActions, dispatch),
    modalActions: bindActionCreators(ModalActions, dispatch),
    systemActions: bindActionCreators(SystemActions, dispatch),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);