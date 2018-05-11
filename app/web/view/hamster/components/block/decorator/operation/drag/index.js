// export {default as DragSource} from './DragSource';
// export {default as DropSource} from './DropSource';
// export {default as DragLayer} from './DragLayer';
import DragSource from './DragSource';
// import DropSource from './DropSource';
import withHamster from '../../withHamster';

export const DragSourceWithHamster = (...args) => WrapComponent => withHamster(DragSource(...args)(WrapComponent));

export const DropSourceWithHamster = (...args) => WrapComponent => withHamster(DropSource(...args)(WrapComponent));
