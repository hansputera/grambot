import type Client from "../../class/client";
import type Context from "../../class/context";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "../../typings";

@Command({
	name: "loop",
	description: "Repeat current music",
	aliases: ["repeat"],
	path: __filename
})
export default class NowPlayingCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}
	public async run(ctx: Context): Promise<void> {
		const q = this.client.queues.get(ctx.message.chatId as number);
		if (!q || !q.length) {
			await ctx.reply("There is nothing queue");
			return;
		}
		
		q[0].loop = !q[0].loop;
		await ctx.reply(`Looping has ${q[0].loop ? "enabled" : "disabled"}`);
	}
}