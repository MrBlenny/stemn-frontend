import { BrowserWindow, screen, Menu, shell } from 'electron';
import path from 'path';
import process from 'process';
import Positioner from 'electron-positioner';

const menuBarHtml = path.join(__dirname, '../renderer/assets/html/menubar.html');
const WINDOW_WIDTH = 330;
//const WINDOW_WIDTH = 600;
const WINDOW_HEIGHT = 450;
const HORIZ_PADDING = 15;
const VERT_PADDING = 30;

export const create = () => {
  let browserWindow = null;
  let lastPosition = undefined;

  if (browserWindow !== null) {
    return browserWindow;
  }

  browserWindow = new BrowserWindow({
    show: false,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true
  });

  if (process.env.NODE_ENV === 'development') {
    browserWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          browserWindow.inspectElement(x, y);
        }
      }]).popup(browserWindow);
    });
  }

  function handleRedirect(e, url) {
    if (url !== browserWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }

  browserWindow.webContents.on('will-navigate', handleRedirect);
  browserWindow.webContents.on('new-window', handleRedirect);

  browserWindow.loadURL(`file://${menuBarHtml}`);
  browserWindow.on('blur', () => {
    browserWindow.hide();
  });

  return {
    browserWindow: browserWindow,
    show: show
  };

  function show({ reposition } = {}){ // Set default otherwise ir crashes if the function has no inputs...
    if(reposition || !lastPosition){
      const cursorPosition = screen.getCursorScreenPoint();
      const primarySize = screen.getPrimaryDisplay().workAreaSize; // Todo: this uses primary screen, it should use current
      const trayPositionVert = cursorPosition.y >= primarySize.height/2 ? 'bottom' : 'top';
      const trayPositionHoriz = cursorPosition.x >= primarySize.width/2 ? 'right' : 'left';
      browserWindow.setPosition(getTrayPosX(),  getTrayPosY());
      lastPosition = true; // Set the last position so we can tell if we have positioned before

      ///////////////////////

      function getTrayPosX(){
        // Find the horizontal bounds if the window were positioned normally
        const horizBounds = {
          left:   cursorPosition.x - WINDOW_WIDTH/2,
          right:  cursorPosition.x + WINDOW_WIDTH/2
        }
        // If the window crashes into the side of the screem, reposition
        if(trayPositionHoriz == 'left'){
          return horizBounds.left <= HORIZ_PADDING ? HORIZ_PADDING : horizBounds.left;
        }
        else{
          return horizBounds.right >= primarySize.width ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH: horizBounds.right - WINDOW_WIDTH;
        }
      }
      function getTrayPosY(){
        return trayPositionVert == 'bottom' ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING : cursorPosition.y + VERT_PADDING;
      }
    }

    browserWindow.show();
    browserWindow.focus();

  }
}
