import React from 'react'
import Account from './Account'

import './AccountList.css'

const AccountList = ({ accounts, activeAccount }) => ( //eslint-disable-line
    <div className="accounts">
        {accounts.map((account) => (
            <Account isActive={activeAccount === account} key={account.name} {...account} />
        ))}
    </div>
)

export default AccountList
