import type Context from "../../class/context";
import type Client from "../../class/client";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "../../typings";

@Command({
	name: "queue",
	description: "Showing song list from group queue",
	aliases: ["q", "queues"],
	path: __filename
})
export default class QueueCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}

	public async run(ctx: Context): Promise<void> {
		const queues = this.client.queues.queues[ctx.message.chatId as number];
		if (!queues) {
			await ctx.reply("There is nothing queue");
			return;
		}

		const text = queues.map((q, i) => `\`${i+1}.\` - ${q.title} - ${q.url}${q.url == queues[0].url ? " | `Now playing`" : ""}`).join("\n");
		await ctx.replyWithMarkdown(text, {
			noWebpage: true
		});
	}
}