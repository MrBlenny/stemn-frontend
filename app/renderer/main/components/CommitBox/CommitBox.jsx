import React from 'react';
import styles from './CommitBox.css';
import { Field } from 'react-redux-form';


// Components
import IconButton from 'app/renderer/main/components/Buttons/IconButton';
import {MdDone} from 'react-icons/lib/md';


export default class Commit extends React.Component {


  commitFiles() {
    if(this.name.value && this.description.value){
      this.props.commitFiles([], {
        name: this.name.value,
        description: this.description.value
      })
      this.name.value = '';
      this.description.value = '';
    }
  }

  render() {
    return (
      <div className="p-15">
        <Field model="changes.model.commitSummary">
          <input className={styles.input} type="text" placeholder="Summary"/>
        </Field>
        <Field model="changes.model.commitDescription">
          <textarea className={styles.textarea} placeholder="Detailed Description"></textarea>
        </Field>

        <div className="layout-row layout-align-center">
          <IconButton onClick={()=>{this.CommitFiles()}}><MdDone size="22"/>Add Commit Message</IconButton>
        </div>
      </div>
    );
  }
}
