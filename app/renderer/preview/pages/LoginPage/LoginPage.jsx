// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Component Core
import React from 'react';

// Actions
import * as ElectronWindowsActions from 'app/shared/modules/ElectronWindows/ElectronWindows.actions.js';

// Styles
import classNames from 'classnames';

// Sub Components
import Toolbar from 'app/renderer/menubar/modules/Toolbar/Toolbar.jsx'
import cloudProject   from 'app/renderer/assets/images/pure-vectors/cloud-project.svg';
import Button  from 'app/renderer/main/components/Buttons/Button/Button.jsx';



///////////////////////////////// COMPONENT /////////////////////////////////


// event.sender.send('tray-removed')
// trayIcon.destroy()

export const Component = React.createClass({
  render() {
    const { AuthActions, auth, dispatch } = this.props;
    return (
      <div className="flex layout-column layout-align-center-center text-center">
        <div style={{maxWidth: '300px'}}>
          <img src={cloudProject} style={{width: '100px', height: '100px'}}/>
          <div className="text-title-4" style={{marginBottom: '10px'}}>Connect to Stemn</div>
          <div className="text-title-5" style={{marginBottom: '20px'}}>You must be logged in to Stemn Desktop before you can preview files.</div>
          <Button onClick={() => dispatch(ElectronWindowsActions.show('main'))} className="primary">Get started</Button>
        </div>
      </div>
    );
  }
});


///////////////////////////////// CONTAINER /////////////////////////////////

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps)(Component);