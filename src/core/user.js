

syncio.user = function( syncio, user_socket ){

    this.syncio = syncio;
    this.socket = user_socket;
    this.writables = {};
    this.objects = {};
    this.requests_inc = 1;
    this.requests = {};
    this.token = ( syncio.user_inc++ ).toString(36) + (Math.random() * Math.pow(10,18)).toString(36); // http://jsperfcom/token-generator
             // (this.user_id++).toString(36) + (Math.random() * Math.pow(10,18)).toString(36)  // http://jsperf.com/token-generator-with-id
             //  Number((this.user_id++) + "" + (Math.random() * Math.pow(10,18))).toString(36)

};