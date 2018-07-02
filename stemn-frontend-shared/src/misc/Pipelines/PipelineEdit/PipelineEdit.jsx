import React, { Component } from 'react'
import PipelineStep from './PipelineStep'
import PipelineStage from './PipelineStage'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

const pipeline = {
  stages: [
    {
      label: 'build 1',
      steps: [{
        label: 'do the thing',
        image: 'alpine',
      }, {
        label: 'do the thing',
        image: 'alpine',
      }],
    }, {
      label: 'build 2',
      steps: [{
        label: 'do the thing',
        image: 'alpine',
      }, {
        label: 'do the thing',
        image: 'alpine',
      }],
    },
  ],
}

export default class PipelineEdit extends Component {
  render() {
    return (
      <DragDropContext
        onDragStart={ this.onDragStart }
        onDragEnd={ this.onDragEnd }
      >
        <Droppable
          droppableId="board"
          type="COLUMN"
          direction="horizontal"
          ignoreContainerClipping
        >
          {provided => (
            <div ref={ provided.innerRef } { ...provided.droppableProps }>
              {pipeline.stages.map((key, index) => (
                <div
                  key={ key.label }
                >
                  here
                </div>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    )
  }
}

// <div>
//   { pipeline.stages.map((stage, idx) => (
//     <PipelineStage key={ idx } stage={ stage }>
//       { stage.steps.map(step => (
//         <PipelineStep step={ step } />
//       ))}
//     </PipelineStage>
//   )) }
// </div>