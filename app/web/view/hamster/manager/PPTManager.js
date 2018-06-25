import HamsterManager from './HamsterManager';
import pptActions from '../actions/ppt'

class EditorManager extends HamsterManager {
    initEditor () {
        this.dispatch(pptActions.init())
    }
}

export default EditorManager
