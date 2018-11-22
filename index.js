const cluster = require('cluster')
const worker = require('./worker')

if (cluster.isMaster) {
    const cpuCount = 2
    for (let i = 0; i < cpuCount; i++) {
        cluster.fork()
    }
} else {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    async function demo() {
        console.log('Taking a break...', cluster.worker.id)
        await sleep(2000);
        console.log('Two seconds later', cluster.worker.id)
    }
    async function fun() {
        console.log('fun start...', cluster.worker.id)
        await demo()
        console.log('fun stop...', cluster.worker.id)
    }

    fun();

    console.log('app is running on worker', cluster.worker.id)
}

cluster.on('exit', (worker) => {
    console.log('mayday! mayday! worker', worker.id, ' is no more!')
    cluster.fork()
})