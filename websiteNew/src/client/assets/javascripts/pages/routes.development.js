/*****************************************************************

IMPORTANT!
Any changes made here must be made in routes.production
These files should be almost identical. They should only differ by
which routes are async.

*****************************************************************/

import React                                   from 'react'
import { Route, IndexRoute, Redirect }         from 'react-router'


// Routes which are always sync
import AppAuthed                               from 'pages/AppAuthed'
import AppRoot                                 from 'pages/AppRoot'
import AppUnAuthed                             from 'pages/AppUnAuthed'
import NotFoundView                            from 'pages/NotFound'

// Routes that are async in prod
import File                                    from 'pages/File'
import Home                                    from 'pages/Home'
import Login                                   from 'pages/Login'
import Notifications                           from 'pages/Notifications'
import NotificationsUnread                     from 'pages/NotificationsUnread'
import NotificationsAll                        from 'pages/NotificationsUnread'
import Privacy                                 from 'pages/Privacy'
import Project                                 from 'pages/Project'
import ProjectCommit                           from 'pages/ProjectCommit'
import ProjectCommits                          from 'pages/ProjectCommits'
import ProjectOverview                         from 'pages/ProjectOverview'
import ProjectSettings                         from 'pages/ProjectSettings'
import ProjectSettingsGeneral                  from 'pages/ProjectSettingsGeneral'
import ProjectSettingsTags                     from 'pages/ProjectSettingsTags'
import ProjectSettingsTasks                    from 'pages/ProjectSettingsTasks'
import ProjectSettingsTeam                     from 'pages/ProjectSettingsTeam'
import ProjectTask                             from 'pages/ProjectTask'
import ProjectTasks                            from 'pages/ProjectTasks'
import Register                                from 'pages/Register'
import Security                                from 'pages/Security'
import Settings                                from 'pages/Settings'
import SettingsAccount                         from 'pages/SettingsAccount'
import SettingsBilling                         from 'pages/SettingsBilling'
import SettingsEmails                          from 'pages/SettingsEmails'
import SettingsProfile                         from 'pages/SettingsProfile'
import SettingsProjects                        from 'pages/SettingsProjects'
import Terms                                   from 'pages/Terms'
import User                                    from 'pages/User'
import UserDetails                             from 'pages/UserDetails'
import UserFollowers                           from 'pages/UserFollowers'
import UserFollowing                           from 'pages/UserFollowing'
import UserOverview                            from 'pages/UserOverview'
import UserProjects                            from 'pages/UserProjects'
import UserStars                               from 'pages/UserStars'

export default (
  <Route                                       component={AppRoot}>
    <Route                                     component={AppAuthed}>
      <Route path='settings'                   component={Settings}>
        <IndexRoute                            component={SettingsProfile}/>
        <Route path='account'                  component={SettingsAccount}/>
        <Route path='billing'                  component={SettingsBilling}/>
        <Route path='emails'                   component={SettingsEmails}/>
        <Route path='projects'                 component={SettingsProjects}/>
      </Route>
      <Route path='notifications'              component={Notifications}>
        <IndexRoute                            component={NotificationsUnread}/>
        <Route path='unread'                   component={NotificationsUnread}/>
        <Route path='all'                      component={NotificationsAll}/>
      </Route>
    </Route>
    <Route                                     component={AppUnAuthed}>
      <Route path='login'                      component={Login} />
      <Route path='register'                   component={Register} />
    </Route>
    <Route path='/'                            component={Home} />
    <Route path='/terms'                       component={Terms} />
    <Route path='/security'                    component={Security} />
    <Route path='/privacy'                     component={Privacy} />
    <Route path='/files/:projectId/:fileId'    component={File} />
    <Route path='project/:stub'                component={Project}>
      <IndexRoute                              component={ProjectOverview} />
      <Route path='files/:path'                component={ProjectOverview} />
      <Route path='tasks'                      component={ProjectTasks} />
      <Route path='tasks/:taskId'              component={ProjectTask} />
      <Route path='commits'                    component={ProjectCommits} />
      <Route path='commits/:commitId'          component={ProjectCommit} />
      <Route path='settings'                   component={ProjectSettings}>
        <IndexRoute                            component={ProjectSettingsGeneral} />
        <Route path='tasks'                    component={ProjectSettingsTasks} />
        <Route path='team'                     component={ProjectSettingsTeam} />
        <Route path='tags'                     component={ProjectSettingsTags} />
      </Route>
    </Route>
    <Route path='404'                          component={NotFoundView} />
    <Route path='users/:stub'                  component={User}>
      <IndexRoute                              component={UserOverview} />
      <Route path='details'                    component={UserDetails} />
      <Route path='followers'                  component={UserFollowers} />
      <Route path='following'                  component={UserFollowing} />
      <Route path='projects'                   component={UserProjects} />
      <Route path='stars'                      component={UserStars} />
    </Route>
    <Redirect from='*'                         to='404' />
  </Route>
)