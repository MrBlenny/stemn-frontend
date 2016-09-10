import React from 'react';
import { connect } from 'react-redux';
import { Field, actions } from 'react-redux-form';

import CheckboxAlt from 'app/renderer/main/components/Input/CheckboxAlt/CheckboxAlt.jsx'
import classes from './LabelSelect.css'

export const Component = React.createClass({
  render(){
    const { model, value, labelInfo, dispatch } = this.props
    return (
      <div>
        {labelInfo.map((label) => {
          const onChange = () => {
            const labelIndex = value ? value.indexOf(label._id) : -1;
            if(labelIndex != -1){
              dispatch(actions.remove(model, labelIndex))
            }
            else{
              dispatch(actions.push(model, label._id))
            }
          };
          return (
            <CheckboxAlt status={value ? value.includes(label._id) : false} value={label._id} onChange={onChange} className="layout-row layout-align-start-center">
              <div className={classes.swatch} style={{background: label.color}}></div>
              {label.name}
            </CheckboxAlt>
          )
        })}
      </div>
    );
  }
});
export default connect()(Component)
