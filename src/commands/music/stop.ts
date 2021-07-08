import type Client from "../../class/client";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "typings";
import type Context from "../../class/context";

@Command({
	name: "stop",
	description: "Stopping current music session",
	aliases: ["disconnect", "dc"],
	path: __filename,
})
export default class StopCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}
	public async run(ctx: Context): Promise<void> {
		const hasVoice = await this.client.gramjs.telegram.hasVoiceChat(ctx.message.chatId as number);
		if (!hasVoice) {
			await ctx.replyWithMarkdown("Please create a **group voice call** first before execute this command!");
			return;
		}

		const q = this.client.connections.connections[ctx.message.chatId as number];
		if (!q) {
			await ctx.replyWithMarkdown("**No there music is playing**");
			return;
		}

		await this.client.connections.stop(ctx.message.chatId as number);
		this.client.connections.remove(ctx.message.chatId as number);
		this.client.queues.clear(ctx.message.chatId as number);
		await ctx.reply(`Stopped by @${ctx.message.sender.username}`);
	}
}