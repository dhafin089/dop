
// Create a remote function
syncio.instance.prototype.create_remote_function = function ( path ) {

    var that = this;
    // return function remote_function() {

    //     return that.call( path, arguments );

    // };
	
	// http://jsperf.com/dynamic-name-of-functions
    return new Function(
        "return function " + syncio.remote_function + "(){  return that.call( path, arguments ); }"
    )();

};