import { connect } from 'react-redux'
import { PipelineGraphStepComponent } from './PipelineGraphStep'
import { IPipelineGraphStoreState } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.reducer'
import { PipelineGraphStepModel } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraphStep/PipelineGraphStep.model'
import { selectStep } from '../PipelineGraph.actions'

const stateToProps = (
  { pipelineGraph }: { pipelineGraph: IPipelineGraphStoreState }, 
  { node }: { node: PipelineGraphStepModel}
) => ({
  isSelected: pipelineGraph.diagrams[node.parent.id].selectedStep === node.id,
})

const dispatchToProps = {
  selectStep,
}

export const PipelineGraphStep = connect(stateToProps, dispatchToProps)(PipelineGraphStepComponent)
