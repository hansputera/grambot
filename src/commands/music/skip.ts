import { Command } from "../../decors";
import type Client from "../../class/client";
import type Context from "../../class/context";
import type { CommandComponent, CommandProps } from "../../typings";

@Command({
	name: "skip",
	description: "Skipping current music",
	aliases: ["s"],
	path: __filename,
	cooldown: 15000
})
export default class SkipCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}

	public async run(ctx: Context): Promise<void> {
		const voiceHas = await this.client.gramjs.telegram.hasVoiceChat(ctx.message.chatId as number);
		if (!voiceHas) {
			await ctx.reply("This group hasn't group voice call");
			return;
		}

		const q = this.client.queues.queues[ctx.message.chatId as number];
		if (!q) {
			await ctx.reply("There is nothing queue");
			return;
		}

		const res = await this.client.connections.stop(ctx.message.chatId as number);
		switch(res) {
		case 0:
			await ctx.reply(`Skipped by @${ctx.message.sender.username}`);
			break;
		case 1:
			await ctx.replyWithMarkdown("**Not playing**");
			break;
		case 2:
			await ctx.replyWithMarkdown("**Not in call**");
			break;
		}
	}
}