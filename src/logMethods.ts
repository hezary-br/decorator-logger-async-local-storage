import { AsyncLocalStorage } from "async_hooks"
// import "reflect-metadata";
// const requiredMetadataKey = Symbol("required");

const als = new AsyncLocalStorage()
function ctxLog(...args: any[]) {
  let prefix = []
  const moduleName = als.getStore()
  if (moduleName) prefix.push(`[${moduleName}]`)
  console.log(prefix.join(" ").concat(" -"), ...args)
}

const log = (
  _target: any,
  propertyName: string,
  propertyDescriptor: PropertyDescriptor
) => {
  const method = propertyDescriptor.value
  propertyDescriptor.value = function (...args: any[]) {
    return als.run(
      `${this.constructor.name}.${propertyName}`,
      method.bind(this, ...args)
    )
  }
}

var value = 40

const logMethods = (target: any) => {
  const propertyNames = Object.getOwnPropertyNames(target.prototype)
  for (const propertyName of propertyNames) {
    console.log({ propertyName })
    if (propertyName === "constructor") continue
    const descriptor = Object.getOwnPropertyDescriptor(
      target.prototype,
      propertyName
    )
    if (descriptor && typeof descriptor.value === "function") {
      log(target.prototype, propertyName, descriptor)
      Object.defineProperty(target.prototype, propertyName, descriptor)
    }
  }
}

@logMethods
class Person {
  value = 30

  walk(miles: number) {
    ctxLog(`Person walked ${miles} miles.`)
  }

  run() {
    ctxLog("Person runned.", this.value)
  }
}

const person = new Person()

Person.prototype.value
person.run()
person.walk(300)
setTimeout(() => {
  person.run()
}, 1000)
// person.run()
