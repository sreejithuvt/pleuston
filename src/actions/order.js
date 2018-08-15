
export async function buildOrdersFromEvents(events, contract, account) {
    const { acl, market } = contract
    return events
        .filter(obj => (obj.args._consumer === account.name))
        .map((event) => ({
            ...event.args,
            timeout: event.args._timeout.toNumber(),
            status: acl.statusOfAccessRequest(event.args._id).then((status) => status.toNumber()),
            paid: market.verifyPaymentReceived(event.args._id).then((received) => received),
            key: null
        }))
}
