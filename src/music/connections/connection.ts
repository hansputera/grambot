/* eslint-disable no-mixed-spaces-and-tabs */
import Client from "../../class/client";
import CallsClient from "../calls";
import { Readable } from "stream";
import { TGCalls, Stream } from "tgcalls";
import queue from "../queue";

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

    async end(): Promise<void> {
    	this.playing = false;
    	const q = queue.get(this.chatId);
    	if (q?.readable) this.setReadable(q.readable);
    	else {
    		await this.calls.leaveCall(this.chatId);
    		this.remove();
    	}
    }

    async setReadable(readable: Readable): Promise<void> {
    	this.stream.setReadable(readable);
    	this.playing = true;
    }

    async joinCall(readable: Readable): Promise<void> {
    	this.stream = new Stream(readable, 16, 48000, 1);
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