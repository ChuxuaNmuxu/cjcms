import parser, {baseStyleParser, removeProps, filterNotObject} from '../../app/web/view/hamster/components/block/parser';
import {fromJS} from 'immutable';

test('test removeProps', () =>{
    const animation = {effect: "none", duration: 0, delay: 0, trigger: 'click', index: 1};
    const filt = ['trigger', 'index'];
    const result = {effect: "none", duration: 0, delay: 0};

    expect(removeProps(fromJS(filt), animation)).toEqual(result)
})

test('test filter object', () => {
    const animation = {effect: "none", duration: 0, delay: 0, trigger: 'click', index: 1};
    const filt = {trigger: 'click', index: 1};
    const result = {effect: "none", duration: 0, delay: 0};

    expect(filterNotObject(animation)(fromJS(filt))).toEqual(result)
})

test('parse style', () => {
    const block = {
        data: {
            type: 'shape',
            props: {
                animation: {effect: "none", duration: 0, delay: 0, trigger: 'comein', index: 1},
                border: {borderStyle: "none", borderWidth: 0, borderColor: "#fff"},
                color: "",
                font: {textAlign: "left", fontSize: 18, fontStyle: "none", fontFamily: "none", color: "#000"},
                height: 0,
                left: 0,
                lineHeight: 1.3,
                opacity: 100,
                rotation: 0,
                top: 0,
                width: 0,
                zIndex: 10,
            }
        }
    }

    const style = {
        color: "#000",
        fontFamily: "none",
        fontSize: "18px",
        fontStyle: "none",
        height: "0px",
        left: "0px",
        lineHeight: 1.3,
        opacity: "1",
        rotation: "rotate(0deg)",
        textAlign: "left",
        top: "0px",
        width: "0px",
        zIndex: 10,
        animation: 'none 0 0 forwards'
    }

    expect(parser(fromJS(block)).style).toEqual(style);
})
