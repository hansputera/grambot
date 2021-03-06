/* eslint-disable no-mixed-spaces-and-tabs */
import { ClientEvents } from "typings";
import GramClient from "./gramclient";
import { TypedEmitter } from "tiny-typed-emitter";
import { Api } from "telegram";
import { parseCommand } from "../util/message";
import Modules, { aliases, commands } from "./modules";
import { join } from "path";
import bigInt from "big-integer";
import Connections from "../music/connections";
import signal from "../signal";
import queue from "../music/queue";

export default class Client extends TypedEmitter<ClientEvents> {
    public gramjs = new GramClient();
    public Api = Api;
    public commands = commands;
    public aliases = aliases;
	public connections = new Connections(this);
	public signal = signal;
	public queues = queue;

	constructor() {
    	super();

    	this.gramjs.onNewMessage((ctx) => {
    		this.emit("message", ctx);
    		const parses = parseCommand(ctx.message.text, ctx.message.entities);
    		if (parses && !ctx.message.sender.is_bot) this.emit("command", ctx, parses);
    	});
    	// this.gramjs.onError((err) => {
    	// 	this.emit("error", err);
    	// });
		this.gramjs.onRawUpdate();
	}

	public launch(): Promise<void> {
    	new Modules(this, join(__dirname, "..", "commands")).load();
    	return this.gramjs.launch();
	}

	public genId(): number {
    	return bigInt(-Math.floor(Math.random() * 10000000000)).toJSNumber();
	}
}
