import React from 'react'
import Account from './Account'

const AccountList = ({ accounts, activeAccount }) => ( //eslint-disable-line
    <div>
        {
            accounts.map((account) => (
                <Account key={account.name} {...account} />
            ))
        }
    </div>
)


export default AccountList
