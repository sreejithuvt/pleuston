import React from 'react'
import Account from './Account'

import './AccountList.css'

const AccountList = ({ accounts, handleClick }) => ( //eslint-disable-line
    <div className="accounts">
        {
            accounts.map((account) => (
                <Account
                    key={account.name}
                    {...account}
                    onClick={(e) => handleClick(account, e)} />
            ))
        }
    </div>
)


export default AccountList
