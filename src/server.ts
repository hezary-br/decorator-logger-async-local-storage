import { AsyncLocalStorage } from "async_hooks"

const als = new AsyncLocalStorage()

export const ctxLog = (...args: any[]) => {
  let prefix = []
  const moduleName = als.getStore()
  if (moduleName) prefix.push(`[${moduleName}]`)
  console.log(prefix.join(" ").concat(" -"), ...args)
}

class Person {

  walk() {
    ctxLog("Person walked.")
  }

  run() {
    ctxLog("Person runned.")
  }
}

const person = new Person()
person.run()