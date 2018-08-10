import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Home from './pages/Home'
import Datasets from './pages/Datasets'
import NewDataset from './pages/NewDataset'
import Orders from './pages/Orders'
import DatasetLoader from './containers/DatasetLoader'

const Routes = () => (
    <Switch>
        <Route exact component={Home} path="/" />
        <Route exact component={NewDataset} path="/datasets/new" />
        <Route exact component={Datasets} path="/datasets" />
        <Route exact component={DatasetLoader} path="/datasets/:id" />
        <Route exact component={Orders} path="/orders" />
        <Route component={NotFound} />
    </Switch>
)

export default Routes
