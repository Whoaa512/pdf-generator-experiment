let DEBUG = false

export const log = {
    debug(...args) {
        if (!DEBUG) {
            return
        }
        /* eslint-disable-next-line no-console */
        console.debug(...args)
    },
    error(...args) {
        /* eslint-disable-next-line no-console */
        console.error(...args)
    },
    info(...args) {
        /* eslint-disable-next-line no-console */
        console.log(...args)
    },
}

export const setDebug = val => {
    DEBUG = Boolean(val)
}
