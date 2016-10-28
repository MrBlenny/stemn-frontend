import React from 'react';
import Input from 'app/renderer/main/components/Input/Input/Input'

// Styles
import styles from './Toggle.css';

export default React.createClass({
  render(){
    const { value, model, title, className, changeAction} = this.props;

    const id = Math.random().toString(36).substring(7);
    return (
      <div
        title={title}
        className={styles.toggle}>
        <Input 
          type="checkbox"
          value={value}
          model={model}
          changeAction={changeAction}
          className={value ? 'checked' : ''}
          id={id}
        />
        <label htmlFor={id}></label>
      </div>
    )
  }
});