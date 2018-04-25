import React, {Component} from 'react';
import {Form, Input, Button} from 'antd';
import { TwitterPicker } from 'react-color';
import PropTypes from 'prop-types';
const FormItem = Form.Item;
const InputGroup = Input.Group;

const colorConfig = [
    '#FFFFFF', '#4D4D4D', '#999999', '#F44E3B', '#FE9200',
    '#FCDC00', '#333333', '#808080', '#cccccc', '#D33115',
    '#E27300', '#FCC400', '#000000', '#666666', '#B3B3B3',
    '#9F0500', '#C45100', '#FF8C00', '#DBDF00', '#A4DD00',
    '#68CCCA', '#73D8FF', '#AEA1FF', '#FDA1FF', '#B0BC00',
    '#68BC00', '#16A5A5', '#009CE0', '#7B64FF', '#FA28FF',
    '#808900', '#194D33', '#0C797D', '#0062B1', '#653294',
    'transparent'
];

class Color extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showColorPicker: false,
            color: props.value || '#FF8C00'
        };

        this.toggleColorPicker = this.toggleColorPicker.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                color: nextProps.value
            })
        }
    }

    toggleColorPicker () {
        this.setState({
            showColorPicker: !this.state.showColorPicker
        })
    }

    handleClose () {
        this.setState({
            showColorPicker: false
        })
    }

    handleColorChange = (color) => {
        this.setState({
            color: color.hex
        })
        this.onChange(color.hex)
    }

    onChange = (value) => {
        const {onChange} = this.props
        onChange && onChange(value)
    }

    render () {
        const formItemProps = {
            colon: false
        }
        const {color} = this.state;
        const addonAfter = (
            <Button
              size='small'
              style={{
                  borderRadius: 0,
                  border: 'none',
                  height: 22,
                  width: 22,
                  backgroundColor: color
              }}
              onClick={this.toggleColorPicker}>
            </Button>
        )
        return (
            <div>
                <Input value={color} addonAfter={addonAfter} readOnly />
                {
                    this.state.showColorPicker &&
                    <div style={{ position: 'absolute', zIndex: '2', right: 4 }}>
                        <div style={{position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px'}} onClick={this.handleClose} />
                        <TwitterPicker onChange={this.handleColorChange} color={color || '#FF8C00'} colors={colorConfig} />
                    </div>
                }
            </div>
        )
    }
}

Color.propWs = {
    onChange: PropTypes.func,
    value: PropTypes.string
}

export default Color;
