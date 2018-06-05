import React from 'react'
import Blockies from 'react-blockies'

import './Account.css'

const Account = (props) => (
    <div className="account--item">
        <Blockies seed={props.name} />
        <div>{props.name}</div>
        <div className="account--item--balance__container">
            <div className="account--item--balance">
                {
                    props.balance
                }
            </div>
        </div>
    </div>
)

export default Account
