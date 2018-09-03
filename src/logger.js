export default class Logger {
    static dispatch(verb, ...args) {
        /* eslint-disable-next-line no-console */
        console[verb](...args)
    }

    static log(...args) {
        Logger.dispatch('log', ...args)
    }

    static debug(...args) {
        Logger.dispatch('debug', ...args)
    }

    static error(...args) {
        Logger.dispatch('error', ...args)
    }
}
