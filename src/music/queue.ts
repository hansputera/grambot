/* eslint-disable no-mixed-spaces-and-tabs */
import type Song from "./class/song";

class Queue {
    public queues: Record<number, Song[]> = {};

    push(chatId: number, song: Song): number {
    	if (chatId in this.queues) this.queues[chatId].push(song);
    	else this.queues[chatId] = [song];
    	return this.queues[chatId].length;
    }

    get(chatId: number): Song[] {
    	if (chatId in this.queues) return this.queues[chatId];
    	else return [];
    }

    clear(chatId: number): boolean {
    	if (chatId in this.queues) {
    		delete this.queues[chatId];
    		return true;
    	}
    	return false;
    }
}

export default new Queue();