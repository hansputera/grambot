import { TypedEmitter } from "tiny-typed-emitter";
import type { SignalEvents } from "./typings";

class Signal extends TypedEmitter<SignalEvents> {
	constructor() { super(); }
}

export default new Signal();