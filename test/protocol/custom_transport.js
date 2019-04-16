global.tokeninc = 1
var test = require('tape')
var WebSocket = require('ws')
var dop = require('../.proxy').create()
var dopServer = dop.create()
var dopClient = dop.create()

const port = 8989
const transportServer = new dopServer.core.transport()
const transportClient = new dopClient.core.transport()

// SERVER
const wsServer = new WebSocket.Server({ port })
wsServer.on('connection', function(socket) {
    transportServer.onOpen(
        socket,
        socket.send.bind(socket),
        socket.close.bind(socket)
    ) // do not send any message before onOpen
    socket.on('message', function(message) {
        transportServer.onMessage(socket, message)
    })
    socket.on('close', function() {
        transportServer.onClose(socket)
    })
})

// CLIENT
;(function reconnect(wsClientOld) {
    let keepReconnecting = true
    const wsClient = new WebSocket('ws://localhost:' + port)
    const send = wsClient.send.bind(wsClient)
    const close = () => {
        keepReconnecting = false
        wsClient.close()
    }
    wsClient.on('open', function() {
        if (wsClientOld === undefined) {
            transportClient.onOpen(wsClient, send, close)
        } else {
            transportClient.onReconnect(wsClientOld, wsClient, send, close)
        }
        wsClient.on('message', function(message) {
            transportClient.onMessage(wsClient, message)
        })
        wsClient.on('close', function() {
            transportClient.onClose(wsClient)
            if (keepReconnecting) reconnect(wsClient)
        })
    })
})()

transportServer.type = 'SERVER'
transportClient.type = 'CLIENT'

var nodeServer
var nodeClient
var socketClient
var socketServer
test('CLIENT onCONNECT', function(t) {
    transportClient.on('connect', function(node) {
        nodeClient = node
        socketClient = node.socket
        t.equal(Object.keys(transportClient.nodesByToken).length, 1)
        t.equal(transportClient.nodesBySocket.size, 1)
        t.end()
    })
})

test('SERVER onCONNECT', function(t) {
    transportServer.on('connect', function(node) {
        nodeServer = node
        socketServer = node.socket
        t.equal(nodeServer.token, nodeClient.token)
        t.equal(Object.keys(transportServer.nodesByToken).length, 1)
        t.equal(transportServer.nodesBySocket.size, 1)
        nodeClient.socket.close()
        t.end()
    })
})

test('CLIENT onRECONNECT', function(t) {
    transportClient.on('reconnect', function(node) {
        t.equal(nodeClient, node)
        t.notEqual(nodeClient.socket, socketClient)
        t.equal(Object.keys(transportClient.nodesByToken).length, 1)
        t.equal(transportClient.nodesBySocket.size, 1)
        t.end()
    })
})

test('SERVER onRECONNECT', function(t) {
    transportServer.on('reconnect', function(node) {
        t.equal(nodeServer, node)
        t.notEqual(nodeServer.socket, socketServer)
        t.equal(Object.keys(transportServer.nodesByToken).length, 1)
        t.equal(transportServer.nodesBySocket.size, 1)
        t.end()
    })
})

test('SERVER RUN disconnect()', function(t) {
    transportServer.on('disconnect', function(node) {
        t.end()
    })
    nodeServer.disconnect()
})
