import test from 'ava'
import { DJSON } from '../'

const UNDEFINED = 'UNDEFINED' // fake undefined

DJSON.addType(({ getUniqueKey }) => ({
    key: '$undefined',
    isValidToStringify: (value, prop, object) => {
        return value === UNDEFINED
    },
    isValidToParse: (value, prop, object) => {
        const unique_key = getUniqueKey(value)
        return unique_key === '$undefined' && value.$undefined === 1
    },
    stringify: () => {
        return { $undefined: 1 }
    },
    parse: () => {
        return UNDEFINED
    }
}))

function testBasic(t, patch, expected, recursive = true) {
    const string = DJSON.stringify(patch)
    const jsonparsed = JSON.parse(string)
    const parsed = DJSON.parse(string)
    t.deepEqual(expected, jsonparsed)
    t.deepEqual(patch, parsed)
}

test('Valid type', function(t) {
    const patch = { convert: UNDEFINED }
    const expected = { convert: { $undefined: 1 } }
    testBasic(t, patch, expected)
})

test('Escape', function(t) {
    const patch = { escape: { $undefined: 1 } }
    const expected = { escape: { $escape: { $undefined: 1 } } }
    testBasic(t, patch, expected)
})

test('Ignore', function(t) {
    const patch = { ignore: { $undefined: 1, $other: 1 } }
    const expected = { ignore: { $undefined: 1, $other: 1 } }
    testBasic(t, patch, expected)
})

// test('$escaping', function(t) {
//     const patch = {
//         convert: UNDEFINED,
//         escape: { $undefined: UNDEFINED }
//     }
//     const expected = {
//         convert: { $undefined: UNDEFINED },
//         escape: { $escape: { $undefined: UNDEFINED } }
//     }
//     testBasic(t, patch, expected)
// })

// test('This should not be escaped because $undefined has another valid prop', function(t) {
//     const patch = {
//             convert: UNDEFINED,
//             escape: { $undefined: UNDEFINED, $escape: UNDEFINED }
//     }
//     const expected = {
//             convert: { $undefined: UNDEFINED },
//             escape: { $undefined: UNDEFINED, $escape: UNDEFINED }
//     }
//     testBasic(t, patch, expected)
// })

// test('This should not be escaped because $undefined has another valid prop 2', function(t) {
//     const patch = {
//             convert: UNDEFINED,
//             escape: { $escape: UNDEFINED, $undefined: UNDEFINED }
//     }
//     const expected = {
//             convert: { $undefined: UNDEFINED },
//             escape: { $escape: UNDEFINED, $undefined: UNDEFINED }
//     }
//     testBasic(t, patch, expected)
// })

// test('This should not be escaped because $undefined is not an number', function(t) {
//     const patch = {
//          convert: UNDEFINED, escape: { $undefined: 'string' }
//     }
//     const expected = {
//          convert: { $undefined: UNDEFINED }, escape: { $undefined: 'string' }
//     }
//     testBasic(t, patch, expected) // testBasic(t, patch, expected) // Not sure why EJSON is still escaping strings
// })
