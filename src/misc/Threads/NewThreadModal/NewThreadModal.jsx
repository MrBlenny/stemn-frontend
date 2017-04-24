import React, { Component, PropTypes } from 'react'
import { get } from 'lodash'
import classes from './NewThreadModal.css'
import classNames from 'classnames'
import Button from 'stemn-shared/misc/Buttons/Button/Button'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import Input from 'stemn-shared/misc/Input/Input/Input'
import Editor from 'stemn-shared/misc/Editor/Editor.jsx';
import PopoverDropdown from 'stemn-shared/misc/PopoverMenu/PopoverDropdown'
//  filterOptions = [{
//    value: 'commits',
//    name: 'Filter: Commits',
//    onClick: () => this.pushFilter('commits'),
//  }, {
//    value: 'revisions',
//    name: 'Filter: Revisions',
//    onClick: () => this.pushFilter('revisions'),
//  }, {
//    value: 'task-complete',
//    name: 'Filter: Task Complete',
//    onClick: () => this.pushFilter('task-complete'),
//  }]
export default class NewThreadModal extends Component {
  newThread = () => {
    const { newTask, newComment, board } = this.props;
    const group = get(board, 'newThread.group', board.data.groups[0]._id)
    const name = get(board, 'newThread.name')
    const body = get(board, 'newThread.body')
    const boardId = board.data._id
    newTask({
      boardId,
      task: {
        name,
        group,
        boardId,
      },
    }).then((response) => {
      // After the task is created, create a comment if there is a body.
      if (body && body.length > 1) {
        const task = response.value.data._id
        newComment({
          comment: {
            task,
            body,
          }
        })
      }
    })
  }
  render() {
    const { modalConfirm, board, boardModel } = this.props

    console.log(board.data.groups)
    const groupOptions = board.data.groups.map(group => ({
      value: group._id,
      name: group.name,
      onClick: () => console.log('click'),
    }))

    return (
      <div style={ { width: '600px'} }>
        <div className={ classes.modalTitle }>Create a new thread</div>
        <div className={ classes.modalBody }>
          <div className={ classNames(classes.titleSection, 'layout-row layout-align-start-center') }>
            <Textarea
              model={ `${boardModel}.newThread.name` }
              value={ get(board, 'newThread.name') }
              className="text-title-4 input-plain flex"
              placeholder="Untitled Thread"
              autoFocus
            />
            <PopoverDropdown
              options={ groupOptions }
              value={ get(board, 'newThread.group', board.data.groups[0]._id) }
            >
              Group:&nbsp;
            </PopoverDropdown>
          </div>
          <div className={ classes.bodySection }>
            <Editor
              model={ `${boardModel}.newThread.body` }
              value={ get(board, 'newThread.body') }
              placeholder="Thread description"
            />
          </div>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button
            style={ { marginRight: '10px' } }
            onClick={ modalConfirm }>
            Cancel
          </Button>
          <Button
            className="primary"
            onClick={ this.newThread }
          >
            Create
          </Button>
        </div>
      </div>
    )
  }
}
