import { combineReducers } from 'redux'
import rootReducer from './rootReducer.base'
import storeReducer from 'stemn-shared/misc/Store/Store.reducer.js'

export default function getRootReducer() {
  const reducers = {
    ...rootReducer,
  }

  const splitReducers = combineReducers({ ...reducers })
  return (state, action) => {
    const isStoreAction = action && action.type && action.type.startsWith('STORE/')
    return isStoreAction
      ? splitReducers(storeReducer(state, action), action) // This is fed into the split reducers so defaults can init if the keys are cleared
      : splitReducers(state, action)
  }
}
