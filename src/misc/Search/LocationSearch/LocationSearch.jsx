import React, { Component, PropTypes } from 'react';
import { connect } from  'react-redux'
import { actions } from 'react-redux-form'
import classes from './LocationSearch.css'

import Autosuggest from 'stemn-shared/misc/Autosuggest/Autosuggest.container';
import Highlight from 'stemn-shared/misc/Autosuggest/Highlight';

@connect()
export default class LocationSearch extends Component {
  static propTypes = {
    select: PropTypes.func,
    cacheKey: PropTypes.string.isRequired,
    model: PropTypes.string,
    value: PropTypes.object,
  }

  select = (value) => {
    // If we pass in a select function, we use it.
    // Otherwise, we use the model
    const { select, model, dispatch } = this.props
    if (select) {
      select(value)
    } else {
      dispatch(actions.change(model, value))
    }
  }

  renderSuggestion = (suggestion, { query }) => {
    return (
      <div className="layout-row layout-align-start-center">
        <div style={ { marginLeft: '10px' } } className="flex">
          <Highlight text={ suggestion.name } query={ query } hightlightClass={ classes.highlight }/>
        </div>
      </div>
    );
  }

  render() {
    const { value, cacheKey } = this.props;

    return (
      <Autosuggest
        initialValue={ value.name }
        cacheKey={ `location-search-${cacheKey}` }
        select={ this.select }
        renderSuggestion={ this.renderSuggestion }
        entityType="location"
        setValue
      />
    );
  }
}
