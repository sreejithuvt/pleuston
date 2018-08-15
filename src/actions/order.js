
export async function buildOrdersFromEvents(events, acl, market, account) {
    return events
        .filter(obj => {
            return (obj.args._consumer === account.name)
        })
        .map(async (event) => ({
            ...event.args,
            status: (await acl.statusOfAccessRequest(event.args._id)),
            paid: (await market.verifyPaymentReceived(event.args._id)),
            key: null
        }))
}
