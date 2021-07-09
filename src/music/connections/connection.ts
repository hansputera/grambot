/* eslint-disable no-mixed-spaces-and-tabs */
import Client from "../../class/client";
import CallsClient from "../calls";
import { Readable } from "stream";
import { TGCalls, Stream } from "tgcalls";
import queue from "../queue";
import { Api } from "telegram";
import ytdl from "ytdl-core";
import { FFmpeg } from "prism-media";

export default class Connection {
    playing!: boolean;
    stream!: Stream;
    tgcalls!: TGCalls<Record<string, unknown>>;
    remove!: () => void;
    private calls = new CallsClient(this.client);

    constructor(private client: Client, public chatId: number, removeFunc: () => boolean) {
    	this.tgcalls = new TGCalls({});
    	this.remove = removeFunc;
    	this.tgcalls.joinVoiceCall = async (payload) => await this.calls.joinCall(chatId, payload);
    }

    private _play(url: string) {
    	const stream = ytdl(url, {
    		filter: "audioonly",
    		quality: "highest"
    	});

    	const transcoder = new FFmpeg({
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

    	return stream.pipe(transcoder);
    }

    async end(): Promise<void> {
    	this.playing = false;
    	const song = queue.queues[this.chatId][0];
    	if (song?.loop) {
    		if (!this.stream.finished) this.stream.finish();
    		song.readable = this._play(song.url);
    		await this.client.gramjs.telegram.sendMessage(this.chatId, `🎶 Repeated **${song?.title}** requested by @${((await this.client.gramjs.getEntity(song?.requester)) as Api.User).username}`, {
    			parseMode: "markdown"
    		});
    		this.setReadable(song.readable);
    		return;
    	}
    	queue.queues[this.chatId].shift();
    	/*const song = queue.queues[this.chatId].shift();
    	if (song?.loop) queue.push(this.chatId, {
    		title: song.title,
    		readable: this._play(song.url),
    		requester: song.requester,
    		url: song.url,
    		loop: song.loop,
    		seconds: song.seconds
    	});*/
    	const q = queue.get(this.chatId)[0];
    	if (q && q?.readable) {
    		const e = await this.client.gramjs.getEntity(q.requester) as Api.User;
    		await this.client.gramjs.telegram.sendMessage(this.chatId, `🎶 Now playing **${q.title}** requested by @${e.username}`, { parseMode: "markdown" });
    		this.setReadable(q.readable);
    	} else {
    		await this.client.gramjs.telegram.sendMessage(this.chatId, "🤙 Queue is empty, leaving group voice.");
    		await this.calls.leaveCall(this.chatId);
    		this.remove();
    	}
    }

    async setReadable(readable: Readable): Promise<void> {
    	this.stream.setReadable(readable);
    	this.playing = true;
    }

    async joinCall(readable: Readable): Promise<void> {
    	this.stream = new Stream(readable);
    	this.stream.on("finish", async() => await this.end());
    	await this.tgcalls.start(this.stream.createTrack());
    	this.playing = true;
    }

    pause(): boolean {
    	if (!this.stream.paused && this.playing) {
    		this.stream.pause();
    		return true;
    	} else return false;
    }

    resume(): boolean {
    	if (this.stream.paused && this.playing) {
    		this.stream.pause();
    		return true;
    	} else return false;
    }

    async stop(): Promise<boolean> {
    	if (!this.stream.finished) {
    		this.stream.finish();
    		await this.end();
    		return true;
    	} else return false;
    }
}