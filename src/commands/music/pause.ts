import type Context from "../../class/context";
import type Client from "../../class/client";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "../../typings";

@Command({
	name: "pause",
	description: "Pause current music",
	aliases: ["paused", "restmusic"],
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

		const res = this.client.connections.pause(ctx.message.chatId as number);
		switch(res) {
		case 0:
			await ctx.reply(`Paused by @${ctx.message.sender.username}`);
			break;
		case 1:
			await ctx.replyWithMarkdown("**Already paused**");
			break;
		case 2:
			await ctx.replyWithMarkdown("**Not in call**");
			break;
		}
	}
}