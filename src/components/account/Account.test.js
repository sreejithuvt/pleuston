import React from 'react'
import ReactDOM from 'react-dom'
import { BigNumber } from 'bignumber.js'

import Account from './Account'

it('Account renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(
        <Account
            balance={{ 'ocn': BigNumber('123456.7e-3'), 'eth': BigNumber('123456.7e-3') }}
            name="hello"
            handleClick={() => null}
            image={null}
        />,
        div
    )
    ReactDOM.unmountComponentAtNode(div)
})
