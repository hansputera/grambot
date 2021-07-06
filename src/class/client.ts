/* eslint-disable no-mixed-spaces-and-tabs */
import { ClientEvents } from "typings";
import GramClient from "./gramclient";
import { TypedEmitter } from "tiny-typed-emitter";
import { Api } from "telegram";
import { parseCommand } from "../util/message";
import Modules, { aliases, commands } from "./modules";
import { join } from "path";

export default class Client extends TypedEmitter<ClientEvents> {
    public gramjs = new GramClient();
    public Api = Api;
    public commands = commands;
    public aliases = aliases;

    constructor() {
    	super();

    	this.gramjs.onNewMessage((ctx) => {
    		this.emit("message", ctx);
    		const parses = parseCommand(ctx.message.text, ctx.message.entities);
    		if (parses) this.emit("command", ctx, parses);
    	});
    	this.gramjs.onError((err) => {
    		this.emit("error", err);
    	});
    }

    public launch(): Promise<void> {
    	new Modules(this.gramjs, join(__dirname, "..", "commands")).load();
    	return this.gramjs.launch();
    }
}
