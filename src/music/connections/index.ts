/* eslint-disable no-mixed-spaces-and-tabs */
import Client from "../../class/client";
import type { Readable } from "stream";
import Connection from "./connection";

export default class Connections {
    public connections: Record<number, Connection> = {};
    constructor(private client: Client) {}

    async setReadable(chatId: number, readable: Readable): Promise<void> {
    	if (chatId in this.connections) this.connections[chatId].setReadable(readable);
    	else {
    		const connection = new Connection(this.client, chatId, () => this.remove(chatId));
    		await connection.joinCall(readable);
    		this.connections[chatId] = connection;
    	}
    }

    inCall(chatId: number): boolean {
    	return !!this.connections[chatId];
    }

    playing(chatId: number): boolean {
    	if (this.inCall(chatId) && this.connections[chatId].playing) return true;
    	return false;
    }

    pause(chatId: number): 0 | 1 | 2 {
    	if (this.inCall(chatId)) {
    		if (this.connections[chatId].pause()) return 0;
    		else return 1;
    	} else return 2;
    }

    resume(chatId: number): 0 | 1 | 2 {
    	if (this.inCall(chatId)) {
    		if (this.connections[chatId].resume()) return 0;
    		else return 1;
    	} else return 2;
    }

    async stop(chatId: number): Promise<0 | 1 | 2> {
    	if (this.inCall(chatId)) {
    		if (await this.connections[chatId].stop()) {
    			if (this.client.queues.get(chatId).length == 0) this.remove(chatId);
    			return 0;
    		} else return 1;
    	} else return 2;
    }

    remove(chatId: number): boolean {
    	if (chatId in this.connections) {
    		delete this.connections[chatId];
    		return true;
    	} else return false;
    }
}