

dop.core.createRequest = function( node, action ) {

    var request_id = node.request_inc++,
        request = Array.prototype.slice.call(arguments, 1);

    request.unshift( request_id );
    request.promise = new dop.util.promise();
    node.requests[request_id] = request;

    return request;

};