import type { Readable } from "stream";

export default class Song {
	constructor(
        public title: string,
        public url: string,
        public seconds: number,
        public requester: number,
        public readable: Readable
	) {}
}