import React from 'react'
import PropTypes from 'prop-types'

import Account from './Account'

import './AccountList.css'


const AccountList = ({
    accounts,
    handleClick,
}) => (
    <div className="accounts">
        {
            accounts.map((account) => (
                <Account
                    key={account.name}
                    {...account}
                    handleClick={() => handleClick(account)} />
            ))
        }
    </div>
)

AccountList.propTypes = {
    accounts: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        balance: PropTypes.string.isRequired,
    }).isRequired).isRequired,
    handleClick: PropTypes.func.isRequired
}

export default AccountList
