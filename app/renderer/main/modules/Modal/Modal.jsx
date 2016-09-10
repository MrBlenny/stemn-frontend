// Container Core
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

// Container Actions
import * as ModalActions from './Modal.actions.js';

// Component Core
import React from 'react';
import Modal from 'react-modal';

// Styles
import classNames from 'classnames';
import classes from './Modal.css'

// Modals
import ConfirmModal from './modals/ConfirmModal.jsx';
import ErrorModal   from './modals/ErrorModal.jsx';
import FileSelectModal from 'app/renderer/main/modules/FileSelect/FileSelectModal.jsx';
import TaskDisplayModal from 'app/renderer/main/modules/Tasks/TaskDisplayModal/TaskDisplayModal.jsx'
import TaskLabelsEditModal from 'app/renderer/main/modules/Tasks/TaskLabelsEditModal/TaskLabelsEditModal.jsx'


const modalComponents = {
  'CONFIRM'     : ConfirmModal,
  'ERROR'       : ErrorModal,
  'FILE_SELECT' : FileSelectModal,
  'TASK'        : TaskDisplayModal,
  'TASK_LABELS' : TaskLabelsEditModal
}

/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// COMPONENT /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////


const ModalRoot = (modal) => {
  if (!modal.modalType) {
    return null
  }
  const SpecificModal = modalComponents[modal.modalType];
  if(!SpecificModal){
    console.error(`${modal.modalType} Modal could not be found`);
    return null
  }
  const extendedModalProps = Object.assign({}, modal.modalProps, {
    modalHide: modal.modalHide,
    modalCancel: modal.modalCancel,
    modalConfirm: modal.modalConfirm
  });
  return (
    <SpecificModal {...extendedModalProps} />
  )
}

export const Component = React.createClass({
  modalHide: function() {

  },

  render: function() {
    const { modal, dispatch } = this.props;

    // This transforms the modalCancel and modalConfirm actions and adds the modalHide action
    const modalExtended = Object.assign({}, modal, {
      modalHide: ()    => { this.props.ModalActions.hideModal({modalId: modal.modalId}) },
      // The cancel and confirm actions can be extended before dispatching
      modalCancel: (extendObject)  => { if(modal.modalCancel) { dispatch(Object.assign({}, modal.modalCancel, extendObject)) }},
      modalConfirm: (extendObject) => { if(modal.modalConfirm){ dispatch(Object.assign({}, modal.modalConfirm, extendObject)) }},
    })

    return (
      <Modal
        isOpen={true}
        onRequestClose={()=>{
          modalExtended.modalCancel()
          modalExtended.modalHide()
        }}
        className={classes.modal}
        overlayClassName={classes.overlay+ ' layout-column layout-align-center-center'}>
        { ModalRoot(modalExtended) }
      </Modal>
    );
  }
});



/////////////////////////////////////////////////////////////////////////////
///////////////////////////////// CONTAINER /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    ModalActions: bindActionCreators(ModalActions, dispatch),
    dispatch
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Component);
