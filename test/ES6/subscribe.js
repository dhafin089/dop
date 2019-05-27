const test = require('tape')
const dop = require('../.proxy')
const { connect } = require('../ES6/.connect.js')

test('basic', async t => {
    const { dopServer, nodeClient, close } = await connect(t)
    const objectServer = dopServer.register({ hello: 'world' })
    dopServer.onSubscribe(() => objectServer)
    const objectClient = await nodeClient.subscribe()
    t.deepEqual(objectServer, objectClient)
    close()
})

test('basic no registered', async t => {
    const { dopServer, nodeClient, close } = await connect(t)
    const objectServer = { hello: 'world' }
    dopServer.onSubscribe(() => objectServer)
    const objectClient = await nodeClient.subscribe()
    t.deepEqual(objectServer, objectClient)
    close()
})

test('basic deep', async t => {
    const { dopServer, nodeClient, close } = await connect(t)
    const objectServer = dopServer.register({
        hello: 'world',
        deep: { value: 'Hello World' }
    })
    dopServer.onSubscribe(() => objectServer.deep)
    const objectClient = await nodeClient.subscribe()
    t.deepEqual(objectServer.deep, objectClient)
    close()
})

test('into()', async t => {
    const { dopServer, nodeClient, close } = await connect(t)
    const objectServer = { hello: 'world' }
    const objectClient = {}
    t.notDeepEqual(objectServer, objectClient)
    dopServer.onSubscribe(() => objectServer)
    const objectClientInto = await nodeClient.subscribe().into(objectClient)
    t.deepEqual(objectServer, objectClient)
    t.notEqual(objectClientInto, objectClient)
    t.equal(objectClientInto, dop.getObjectProxy(objectClient))
    close()
})

test('into() preregistered', async t => {
    const { dopServer, dopClient, nodeClient, close } = await connect(t)
    const objectServer = { hello: 'world' }
    const objectClient = dopClient.register({})
    t.notDeepEqual(objectServer, objectClient)
    dopServer.onSubscribe(() => objectServer)
    const objectClientInto = await nodeClient.subscribe().into(objectClient)
    t.deepEqual(objectServer, objectClient)
    t.equal(objectClientInto, objectClient)
    close()
})

test('into() client deep object', async t => {
    const { dopServer, nodeClient, close } = await connect(t)
    const objectServer = { hello: 'world' }
    const objectClient = { deep: {} }
    t.notDeepEqual(objectServer, objectClient.deep)
    dopServer.onSubscribe(() => objectServer)
    await nodeClient.subscribe().into(objectClient.deep)
    t.deepEqual(objectServer, objectClient.deep)
    close()
})

test('into() client and server deep object', async t => {
    const { dopServer, nodeClient, close } = await connect(t)
    const objectServer = { hello: 'world', deep: { value: 'helloworld' } }
    const objectClient = { hola: 'mundo', deep: { value: 'holamundo' } }
    t.notDeepEqual(objectServer, objectClient)
    dopServer.onSubscribe(() => objectServer.deep)
    await nodeClient.subscribe().into(objectClient.deep)
    t.deepEqual(objectServer.deep, objectClient.deep)
    t.notDeepEqual(objectServer, objectClient)
    close()
})

test('observe mutations after subscription', async t => {
    const { dopServer, dopClient, nodeClient, close } = await connect(t)
    const objectServer = { hello: 'world', second: 'arg' }
    const objectClient = dopClient.register({})
    dopServer.onSubscribe(() => objectServer)
    dopClient
        .createObserver(mutations => {
            t.equal(mutations.length, 2)
            t.deepEqual(objectServer, objectClient)
            close()
        })
        .observeAll(objectClient)
    await nodeClient.subscribe().into(objectClient)
})

// test('into() observe', t => {
//     const dopServer = dop.create()
//     const dopClient = dop.create()
//     const objectServer = dopServer.register({ inc: 0 })
//     const objectClient = dopClient.register({ deep: {} })
//     const transportServer = dopServer.listen({ transport: transportListen })
//     dopServer.onSubscribe(() => objectServer)
//     ;(function loop(times) {
//         const transportClient = dopClient.connect({
//             transport: transportConnect
//         })
//         transportClient.on('connect', async nodeClient => {
//             // t.notDeepEqual(objectServer, objectClient.deep)
//             await nodeClient.subscribe().into(objectClient.deep)
//             t.deepEqual(objectServer, objectClient.deep)
//             const observer = dopClient.createObserver(() => {
//                 t.deepEqual(objectServer, objectClient.deep)
//                 setTimeout(() => {
//                     nodeClient.disconnect()
//                     if (times === 2) {
//                         t.end()
//                         transportServer.socket.close()
//                     } else {
//                         loop(times + 1)
//                     }
//                 }, 0)
//             })
//             observer.observeAll(objectClient)
//             objectServer.inc += 1
//         })
//     })(1)
// })
