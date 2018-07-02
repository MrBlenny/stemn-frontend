
import React, { Component } from 'react'
import { Draggable } from 'react-beautiful-dnd'

export default class PipelineStage extends Component {
  render() {
    // const { children } = this.props
    return (
      <Draggable draggableId="draggable-1" index={ 0 }>
        {(provided, snapshot) => (
          <div
            ref={ provided.innerRef }
            { ...provided.draggableProps }
            { ...provided.dragHandleProps }
          >
            <h4>My draggable</h4>
          </div>
        )}
      </Draggable>
    )
  }
}

// export default class PipelineStage extends Component {
//   render() {
//     // const { children } = this.props
//     return (
//       <div>
//         Stage
//       </div>
//     )
//   }
// }
