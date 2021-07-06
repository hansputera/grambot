import type { CustomSendMessageOptions, TMessage } from "typings";
import type { SendMessageConvert } from "../util/message";
import type GramClient from "./gramclient";

export default class Context {
	constructor(public client: GramClient, public message: TMessage) {}
    
	public async reply(content: string, options?: CustomSendMessageOptions): Promise<SendMessageConvert> {
		return await this.client.telegram.sendMessage(this.message.chatId as number, content, options);
	}

	public async replyWithHTML(content: string, options?: CustomSendMessageOptions): Promise<SendMessageConvert> {
		return await this.client.telegram.sendMessage(this.message.chatId as number, content, {
			parseMode: "html",
			...options
		});
	}

	public async replyWithMarkdown(content: string, options?: CustomSendMessageOptions): Promise<SendMessageConvert> {
		return await this.client.telegram.sendMessage(this.message.chatId as number, content, {
			parseMode: "markdown",
			...options
		});
	}
}