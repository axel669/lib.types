import value from "./setup.js"
import { is, Err } from "../main.js"

const err = Err("test")

console.log(is.Err(err))
console.log(is.Number(value))
err.throw()
