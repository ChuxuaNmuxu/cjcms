import React from 'react'

const DragSource = (type, spec, collect) => {
    // TODO: params check

    return DecoratedComponent => {
        // TODO: state = {monitor}
        return class extends React.Component {
            constructor(props, context) {
                super(props, context);
                
                this.monitor = null;
                console.log('type: ', type)
                console.log('Hamster: ', props.Hamster)
            }

            getCurrentState () {
                return collect && collect(this.monitor)
            }
            
            render () {
                return <DecoratedComponent
                    {...this.props}
                    {...this.state}
                    ref = {e => this.DecoratedComponentRef = e}
                />
            }
        }
    }
}

export default DragSource;
