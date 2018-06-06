import React from 'react'
import Account from './Account'

import './AccountList.css'

const AccountList = ({ accounts }) => ( //eslint-disable-line
    <div className="accounts">
        {
            accounts.map((account) => (
                <Account key={account.name} {...account} />
            ))
        }
    </div>
)


export default AccountList
