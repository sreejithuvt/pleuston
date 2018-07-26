import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Datasets from './pages/Datasets'
import DatasetLoader from './containers/DatasetLoader'

const Routes = () => (
    <Switch>
        <Route exact component={Home} path="/" />
        <Route exact component={Datasets} path="/datasets" />
        <Route exact component={DatasetLoader} path="/datasets/:id" />
        <Route component={NotFound} />
    </Switch>
)

export default Routes
