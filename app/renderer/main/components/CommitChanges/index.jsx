import React from 'react';
import { Field, Form } from 'react-redux-form';
import { ContextMenu, MenuItem, ContextMenuLayer } from "react-contextmenu";

// Components
//import CommitBox from 'app/modules/files/CommitBox/CommitBox.container.js';
import FileChangeRow from './FileChangeRow';
import FileChangeTitleRow from './FileChangeTitleRow';
import FileContextmenu from './FileContextmenu';

// Styles
import styles from './CommitChanges.css';

const contextIdentifier = 'FileChangeCm';
const FileChangeRowContext = ContextMenuLayer(contextIdentifier, (props) => (props))(FileChangeRow)

export default (props) => {
  return (
    <div className="layout-column flex">
      <div className="flex">
        <FileChangeTitleRow text={props.changes.model.files.length + ' file changes'} model="changes.model.toggleAll" value={props.changes.model.toggleAll} changeAction={props.actToggleAll}/>
        {props.changes.model.files.map((file, idx)=><FileChangeRowContext key={idx} text={file.name} clickFn={()=>{props.selectedFileChange({name: file.name})}} isActive={file.name == props.changes.model.selectedFile.name} model={'changes.model.files['+idx+'].selected'} value={file.selected}/>)}
      </div>
      <FileContextmenu identifier={contextIdentifier}/>
    </div>
  )
}
