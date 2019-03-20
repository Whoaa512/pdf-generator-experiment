import { run, log } from './run'

run('./fixtures/test-jsx.txt')
    .then(() => {
        return process.exit()
    })
    .catch(e => {
        log.error(`e:`, e)
        return process.exit(1)
    })
