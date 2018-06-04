import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'

const Routes = () => (
    <Switch>
        <Route exact component={Dashboard} path="/" />
        <Route component={NotFound} />
    </Switch>
)

export default Routes
