
import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd'

export default class PipelineStage extends Component {
  render() {
    const { children } = this.props
    return (
      <Draggable>
        {(provided, snapshot) => (
          <div
            innerRef={ provided.innerRef }
            { ...provided.draggableProps }
          >
            <div isDragging={ snapshot.isDragging } { ...provided.dragHandleProps }>
              Stage
            </div>
            { children }
          </div>
        )}
      </Draggable>
    )
  }
}
