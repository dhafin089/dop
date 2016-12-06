
dop.core.node = function() {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    this.object_owned = {};
    this.object_subscribed = {};
    this.request_inc = 1;
    this.requests = {};
    this.requests_queue = [];
    // Generating token
    do { this.token = dop.util.uuid() }
    while (typeof dop.data.node[this.token]=='object');
};
// Inherit emitter
dop.util.merge(dop.core.node.prototype, dop.util.emitter.prototype);



dop.core.node.prototype.send = function(message) {
    this.emit(dop.CONS.SEND, message);
};

dop.core.node.prototype.disconnect = function() {
    this.emit(dop.CONS.DISCONNECT);
};

dop.core.node.prototype.subscribe = function() {
    dop.protocol.subscribe(this, arguments);
};

