let locked = false

const lock = () => locked = true

const unlock = () => locked = false

const getLocked = ()=> locked

module.exports = {
  getLocked,
  lock,
  unlock
}