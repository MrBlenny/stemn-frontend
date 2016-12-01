import * as LocalPathActions from '../LocalPath/LocalPath.actions.js';
import * as ModalActions from '../../../renderer/main/modules/Modal/Modal.actions.js';
import { getFullPath }   from '../../../renderer/main/modules/Files/Files.actions.js';

import Promise from 'es6-promise';
import { shell } from 'electron';

export function getProviderPath() {
  return {
    type: 'SYSTEM/GET_PROVIDER_PATH',
    aliased: true,
    payload: {
      functionAlias : 'ProviderPathUtils.getPaths',
      functionInputs: [['dropbox', 'drive']]
    }
  };
}

export function getInstallStatus() {
  return {
    type: 'SYSTEM/GET_INSTALL_STATUS',
    aliased: true,
    payload: {
      functionAlias : 'SystemUtils.getInstallStatus',
    }
  };
}

export function openFile({location, path, projectId, provider}) {
  return (dispatch, getState) => {

    const showErrorDialog = ({path}) => {
      dispatch(ModalActions.showModal({
        modalType: 'ERROR',
        modalProps: {
          title: 'File could not be found',
          body: `Could no locate the file/folder:<div class="dr-input text-ellipsis" style="margin: 15px 0">${path}</div>You should double-check this file exists on your computer. Additionally, make sure you have not disabled sync using dropbox/drive's selective-sync feature.`
        }
      }))
    }

    const open = (fullPath) => {
      if(location){
        const success = shell.showItemInFolder(fullPath);
        if(!success){showErrorDialog({path: fullPath})};
        return dispatch({
          type: 'SYSTEM/OPEN_FILE_LOCATION',
          payload: { path: fullPath }
        })
      }else{
        const success = shell.openItem(fullPath);
        if(!success){showErrorDialog({path: fullPath})};
        dispatch({
          type: 'SYSTEM/OPEN_FILE',
          payload: { path: fullPath }
        })
      }
    };

    const storeState = getState();
    return dispatch(getFullPath({path, projectId, provider})).then(fullPath => {
      return open(fullPath)
    })
  }
}
