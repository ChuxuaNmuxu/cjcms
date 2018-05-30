import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

class SlideGroup extends Component {
    render() {
        const {data, children, onContextMenu} = this.props;
        return (
            <div
              style={{paddingBottom: 20}}
              onContextMenu={e => onContextMenu(e, data)}>
                <div
                  style={{background: '#efefef', padding: 5}}
                  onContextMenu={e => onContextMenu(e, data, 'header')}>
                    {data.get('title') || '卡片组-' + data.get('id').substr(-5)}
                </div>
                { children }
            </div>
        );
    }
}
// class SlideGroup extends Component {
//     render() {
//         const {slides, data, entities} = this.props;
//         let groupIndex = 0;
//         const groupSlides = data.getIn(['data', 'slides'])
//         return (
//             <div>
//                 <p>{data.get('title')}</p>
//             {
//                 slides.map((slideId, index) => {
//                     if (groupSlides.includes(slideId)) {
//                         return <Slide
//                           data={entities.get(slideId)}
//                           index={index}
//                           groupIndex={groupIndex++}
//                         />
//                     }
//                 })
//             }
//             </div>
//         );
//     }
// }

SlideGroup.propTypes = {
    data: ImmutablePropTypes.map
};

export default SlideGroup;
