/**
 * 锁机制，在扩展为多线程时
 * 可更改为信号量来控制
 */

let locked = false

const lock = () => locked = true

const unlock = () => locked = false

const getLocked = ()=> locked

module.exports = {
  getLocked,
  lock,
  unlock
}