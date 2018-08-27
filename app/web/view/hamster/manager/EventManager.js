import HamsterManager from './HamsterManager';
import lodash from 'lodash';
import * as miaow from '../utils/miaow';

export default class EventManager extends HamsterManager {
    eventPool = {};

    /**
     * 1. string
     * on('event', func, context)
     * 
     * 2. object
     * on({
     *   'event1': func1,
     *   'event2': func2
     * }, context) 
     * 
     * 3. string
     * on('event1 event2', func, context)
     * @param {*} type 时间名
     * @param {*} listener 事件
     * @param {*} context 上下文
     */
    on (eventNames, listener, context) {
        if (lodash.isString(eventNames)) {
            lodash.flow(
                miaow.slipt(/\s+/g),
                miaow.map(eventName => this._bindEvent(eventName, listener, context))
            )(eventNames)
        } else if (lodash.isOjbect(eventNames)) {
            lodash.map(eventNames, (handler, eventName) => this.on(eventName, handler, listener))
        }
    }

    _bindEvent (eventName, listener, context) {
        const event = this._safeEvent(eventName);

        event.push({
            listener,
            context
        });
    }

    _safeEvent (eventName) {
        let events = this.eventPool[eventName];
        if (!events) events = this.eventPool[eventName] = [];
        return events;
    }

    fire (eventName) {
        const events = this._safeEvent(eventName);
        events.forEach(event => event(this.hamster));
    }

    /**
     * 1. 清空所有事件
     * off()
     * 
     * 2. 清空某事件 
     * off(events)
     * 
     * 3. 清空某时间某函数
     * off(events, listener)
     * @param {*} eventName 
     * @param {*} listener 
     */
    off (eventNames, listener) {
        if (!eventNames) this.eventPool = {};

        eventNames = lodash.concat([], eventNames);

        eventNames.forEach(eventName => {
            if (!listener) {
                this.eventPool[eventName] = []
            } else {
                lodash.remove(this.eventPool[eventName], item => item.listener === listener);
            }
        });

    }

    once (eventNames, listener, context) {
        listener = onceHandler(listener, context);

        if (lodash.isOjbect(eventNames)) {
            lodash.map(eventNames, (handler, eventName) => ({
                eventName,
                handler: this.onceHandler(handler, context)
            }))
        }

        this.on(eventNames, listener, context);

    }

    onceHandler (eventNames, listener, context) {
        return (...args) => {
            listener.apply(context, args);
            this.off(eventNames, listener);
        }
    }
}
