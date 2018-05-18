/**
 * 静态路由文件，服务端的location是不变的，不需要动态路由
 * @https://reacttraining.com/react-router/
 */

// 业务模块
// import Login from 'view/account/client/login';
// import Logout from 'view/account/client/logout';
// import Play from 'view/courseware/play';
// import Editor from 'view/courseware/editor';
// import CourseEntry from 'view/courseware/courseEntry';
import Editor from 'view/Editor';
import Player from 'view/Player';
import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import initialState from '../reducers/initialState';

const NotFound = () => {
    return (
        <Route render={({ staticContext }) => {
            if (staticContext) {
                staticContext.status = 404;
            }
            return (
                <div>
                    <h1>404 : Not Found</h1>
                </div>
            );
        }} />
    );
};
const routes = [
    {
        path: '/',
        component: Editor,
        exact: true,
        fetch: () => Promise.resolve(initialState)
    },
    {
        path: '/player',
        component: Player,
        exact: true,
        fetch: () => Promise.resolve(initialState)
    },
    {
        path: '*',
        component: NotFound
    }
];

export default routes;
