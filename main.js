const is = {
    Empty: (value) => value === null || value === undefined
}
Object.defineProperty(
    is,
    "add",
    {
        enumerable: false,
        writable: false,
        configurable: false,
        value: (source, symbol, name = null) => {
            is[name ?? source.name] = (value) => {
                if (value === null || value === undefined) {
                    return false
                }
                return value[symbol] === true
            }
        }
    }
)
Object.defineProperty(
    is,
    "extend",
    {
        enumerable: false,
        writable: false,
        configurable: false,
        value: (source, name) => {
            const sourceName = name ?? source.name
            const symbol = Symbol(sourceName)
            is[sourceName] = (value) => {
                if (value === null || value === undefined) {
                    return false
                }
                return value[symbol] === true
            }
            source.prototype[symbol] = true
        }
    }
)
Object.defineProperty(
    is,
    "create",
    {
        enumerable: false,
        writable: false,
        configurable: false,
        value: new Proxy(
            {},
            {
                get(_, name) {
                    return (func) => {
                        const symbol = Symbol(name)
                        is.add(func, symbol, name)
                        return (...args) => func(symbol, ...args)
                    }
                }
            }
        )
    }
)

const Err = is.create.Err(
    (symbol, message, details) => {
        const error = {
            message,
            details,
            throw: (type = Error) => {
                throw new type(message, details)
            },
            [symbol]: true,
        }
        return Object.freeze(error)
    }
)

is.extend(Array)
is.extend(Boolean)
is.extend(Boolean, "Bool")
is.extend(Date)
is.extend(Function)
is.extend(Map)
is.extend(Number)
is.extend(RegExp)
is.extend(RegExp, "Regex")
is.extend(Set)
is.extend(String)
is.extend((async () => { }).constructor)
is.extend((function* () { }).constructor)
is.extend((async function* () { }).constructor)

export { is, Err }
