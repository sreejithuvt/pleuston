import React, { Fragment } from 'react'
import ReactDOM from 'react-dom'

import Button from './Button'

it('Button renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <Fragment>
            <Button>I am a button</Button>
            <Button primary="true">I am a primary button</Button>
        </Fragment>,
        div
    )
    ReactDOM.unmountComponentAtNode(div)
})
