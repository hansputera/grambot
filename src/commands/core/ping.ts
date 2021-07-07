/* eslint-disable no-mixed-spaces-and-tabs */
import type Client from "../../class/client";
import type Context from "../../class/context";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "typings";
import { performance } from "perf_hooks";

@Command({
	name: "ping",
	description: "Ping pong",
	aliases: ["pong", "pinkpong"],
	path: __filename,
	category: "general"
})
export default class PingCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}
	public async run(ctx: Context): Promise<void> {
		const start = performance.now();
		const m = await ctx.reply("PONG!");
		if (m) {
			const end = performance.now();
			const time = (end - start).toFixed(2);
			await this.client.gramjs.telegram.editMessage(ctx.message.chatId as number, m.id, "Pong! " + time + "ms");
		}
	}
}