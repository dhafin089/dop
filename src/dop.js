
var dop = {

    version: '0.9.0',
    name: 'dop',
    port: 4444,
    
    // keys
    key_user_token: '~TOKEN_DOP',
    key_object_path: '~PATH',
    encode_function: '~F',
    encode_undefined: '~U',
    encode_regexp: '~R',
    name_remote_function: '$DOP_REMOTE_FUNCTION',

    // Data
    node_inc:0,
    node:{},
    object_inc:0,
    object:{},

    // src
    util:{},
    core:{},
    on:{},
    listener:{},
    connector:{},

};


if ( typeof module == 'object' && module )
    module.exports = dop;