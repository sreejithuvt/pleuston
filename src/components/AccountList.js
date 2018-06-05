import React from 'react'
import Account from './Account'

const AccountList = ({ accounts, activeAccount, handleClick }) => ( //eslint-disable-line
    <div>
        {
            accounts.map((account) => (
                <Account
                    key={account.name}
                    {...account}
                    isActive={activeAccount === account}
                    onClick={handleClick} />
            ))
        }
    </div>
)


export default AccountList
