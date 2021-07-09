import ytdl from "ytdl-core";
import type Client from "../../class/client";
import type Context from "../../class/context";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "../../typings";

@Command({
	name: "nowplaying",
	description: "Show current music playing",
	aliases: ["np", "nowplay"],
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

		const track = q[0];
		const info = await ytdl.getBasicInfo(track.url);
		const text = `- 🤖 Title: ${info.videoDetails.title}\n- 📡 URL: ${track.url}\n- 👤 Uploader: ${info.videoDetails.author.name}\n- 📡👤 Channel URL: ${info.videoDetails.author.channel_url}\n- 🤔 Uploaded at ${info.videoDetails.uploadDate}\n\n${Number(info.videoDetails.likes)} 👍 ${Number(info.videoDetails.dislikes)} 👎${q[1] ? `\nNext queue is: **${q[1].title}**` : ""}`;
		await ctx.replyWithMarkdown(text);
	}
}