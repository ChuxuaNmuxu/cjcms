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
import Hamster from 'view/hamster';
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
        component: Hamster,
        exact: true,
        fetch: () => Promise.resolve(initialState)
    },
    {
        path: '*',
        component: NotFound
    }
];

export default routes;
