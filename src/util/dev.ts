/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";

export default class DevUtil {
	static timeString(seconds: number, forceHours = false): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor(seconds % 3600 / 60);

		return `${forceHours || hours >= 1 ? `${hours}:` : ""}${hours >= 1 ? `0${minutes}`.slice(-2) : minutes}:${`0${Math.floor(seconds % 60)}`.slice(-2)}`;
	}

	static async hastebin(text: string) {
		const { data } = await axios.post("https://hastebin.com/documents", text);
		return { key: data.key as string, url: "https://hastebin.com/raw/" + data.key as string };
	}

	static parseQuery(queries: string[]): { args: string[]; flags: string[]; } {
		const args: string[] = [];
		const flags: string[] = [];
		for (const query of queries) {
			if (query.startsWith("--")) flags.push(query.slice(2).toLowerCase());
			else args.push(query);
		}
		return { args, flags };
	}
	static removeHTMLTags(input: string): string {
		return input.replace(/(<br?\s?\/>)/ig, " \n").replace(/(<([^>]+)>)/ig, "");
	}

	static parseType(input: any): string {
		if (input instanceof Buffer) {
			let length = Math.round(input.length / 1024 / 1024);
			let ic = "MB";
			if (!length) {
				length = Math.round(input.length / 1024);
				ic = "KB";
			}
			if (!length) {
				length = Math.round(input.length);
				ic = "Bytes";
			}
			return `Buffer (${length} ${ic})`;
		}
		return input === null || input === undefined ? "Void" : input.constructor.name;
	}
    
	static async parseEval(input: any): Promise<{ evaled: string; type: string; }> {
		const isPromise =
          input instanceof Promise &&
          typeof input.then === "function" &&
          typeof input.catch === "function";
		if (isPromise) {
			input = await input;
			return {
				evaled: input,
				type: `Promise<${this.parseType(input)}>`
			};
		}
		return {
			evaled: input,
			type: this.parseType(input)
		};
	}
}