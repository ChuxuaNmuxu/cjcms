import displayLayerFactory from '../base/displayLayer'
import Manager from './core/resizeManager'

const ResizeLayer = displayLayerFactory(Manager);
export default ResizeLayer;
