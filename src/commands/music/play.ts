import type Context from "class/context";
import type Client from "../../class/client";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "../../typings";
import scrape from "scrape-youtube";
import queue from "../../music/queue";
import ytdl from "ytdl-core";

@Command({
	name: "play",
	description: "Play music",
	aliases: [
		"p", "playmusic"
	],
	cooldown: 15000,
	ownerOnly: true,
	path: __filename
})
export default class PlayCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}
	public async run(ctx: Context, args: string[]): Promise<void> {
		const query = args.join(" ");
		if (!query.length) {
			await ctx.replyWithMarkdown("Mohon masukan judul lagu!");
			return;
		}
		const { videos } = await scrape.search(query);
		if (!videos.length) {
			await ctx.replyWithMarkdown("Video tidak dapat ditemukan!\nMohon lebih spesifik lagi!");
			return;
		}
		const video = videos[0];
		const readable = ytdl(video.link);
		if (this.client.connections.playing(ctx.message.chatId as number)) {
			const positionNow = queue.push(ctx.message.chatId as number, {
				title: video.title,
				url: video.link,
				seconds: Number(video.duration),
				requester: ctx.message.sender.id,
				readable
			});
			await ctx.replyWithHTML(`<b>#\ufe0f\u20e3 @${ctx.message.sender.username} queued ${video.link} <pre>${positionNow}</pre></b>`);
		} else {
			await ctx.replyWithHTML(`<b>\u25b6\ufe0f @${ctx.message.sender.username} is now playing ${video.link}</b>`);
			await this.client.connections.setReadable(ctx.message.chatId as number, readable);
		}


	}
}