import type Context from "../../class/context";
import type Client from "../../class/client";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "../../typings";

@Command({
	name: "resume",
	description: "Resuming stopped music",
	aliases: ["continue", "continuemusic"],
	path: __filename
})
export default class PauseCommand implements CommandComponent {
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

		const res = this.client.connections.resume(ctx.message.chatId as number);
		switch(res) {
		case 0:
			await ctx.reply(`Resumed by @${ctx.message.sender.username}`);
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