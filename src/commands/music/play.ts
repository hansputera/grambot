import type Context from "class/context";
import type Client from "../../class/client";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "../../typings";
import scrape from "scrape-youtube";
import queue from "../../music/queue";
import ytdl from "ytdl-core";
import Prism from "prism-media";

@Command({
	name: "play",
	description: "Play music",
	aliases: [
		"p", "playmusic"
	],
	cooldown: 15000,
	path: __filename
})
export default class PlayCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}
	public async run(ctx: Context, args: string[]): Promise<void> {
		const hasVoice = await this.client.gramjs.telegram.hasVoiceChat(ctx.message.chatId as number);
		if (!hasVoice) {
			await ctx.replyWithMarkdown("Please create a **group voice call** first before execute this command!");
			return;
		}
		const query = args.join(" ");
		if (!query.length) {
			await ctx.replyWithMarkdown("Please enter song title!");
			return;
		}
		const { videos } = await scrape.search(query);
		if (!videos.length) {
			await ctx.replyWithMarkdown("Video not found\nTry again!");
			return;
		}
		const video = videos[0];
		const transcoder = new Prism.FFmpeg({
			args: [
				"-analyzeduration",
				"0",
				"-loglevel",
				"0",
				"-acodec",
				"pcm_s16le",
				"-f",
				"s16le",
				"-ar",
				"65000",
				"-ac",
				"1"
			],
		});
		const readable = ytdl(video.link, {
			filter: "audioonly",
			quality: "highest",
		});
		
		const out = readable.pipe(transcoder);

		// const opus = new Prism.opus.Encoder({
		// 	rate: 48000,
		// 	channels: 2,
		// 	frameSize: 960,
		// });
		// const outStream = out.pipe(opus);
		// outStream.on("close", () => {
		// 	transcoder.destroy();
		// 	opus.destroy();
		// });
		
		/**
		const m = await ctx.replyWithMarkdown(`Please wait, downloading [${video.title}](${video.link})`, {
			replyToMsgId: ctx.message.id
		});
		this.client.cacheChats[randomUUID().split("-")[0]] = {
			chatId: ctx.message.chatId,
			downloadingVideo: true
		};
*/
		queue.push(ctx.message.chatId as number, {
			title: video.title,
			url: video.link,
			seconds: Number(video.duration),
			requester: ctx.message.sender.id,
			readable: out,
			loop: false
		});
		if (this.client.connections.playing(ctx.message.chatId as number)) {
			await ctx.replyWithHTML(`<b>#\ufe0f\u20e3 @${ctx.message.sender.username} queued ${video.link}</b>`);
		} else {
			await ctx.replyWithHTML(`<b>\u25b6\ufe0f @${ctx.message.sender.username} is now playing ${video.link}</b>`);
			await this.client.connections.setReadable(ctx.message.chatId as number, out);
		}
	}
}