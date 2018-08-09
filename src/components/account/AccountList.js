import React from 'react'
import PropTypes from 'prop-types'

import Account from './Account'
import Empty from '../atoms/Empty'

import './AccountList.css'

const AccountList = ({
    accounts,
    handleClick
}) => (
    <div className="accounts">
        {accounts.length
            ? accounts.map((account, index) => (
                <Account
                    key={account.name}
                    {...account}
                    handleClick={() => handleClick(index)} />
            )) : (
                <Empty title="No accounts found :-(" text="Have you checked your Keeper connection?" />
            )
        }
    </div>
)

AccountList.propTypes = {
    accounts: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        balance: PropTypes.object.isRequired
    }).isRequired).isRequired,
    handleClick: PropTypes.func.isRequired
}

export default AccountList
