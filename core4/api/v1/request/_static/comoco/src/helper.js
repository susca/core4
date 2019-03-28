import { clone } from 'pnbi-base/core4/helper'

/**
 * Create object with defined keys with default value for each key
 *
 * @param {object|array} iterableObj
 * @param {any} defaultValue
 *
 * @returns obj
 */
function objectWithDefaults (iterableObj, defaultValue = 0) {
  let iterator = Array.isArray(iterableObj) ? iterableObj : Object.keys(iterableObj)

  return clone(Object.assign(...iterator.map(k => ({ [k]: clone(defaultValue) }))))
}

export {
  objectWithDefaults
}
