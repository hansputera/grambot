import { Api } from "telegram";
import { EditMessageConvert, SendMessageConvert } from "../util/message";
import type { CustomEditMessageOptions, CustomSendMessageOptions } from "../typings";
import type GramClient from "./gramclient";

export default class TelegramAPI {
	constructor(public client: GramClient) {}
    
	public async sendMessage(chatId: string | number, content: string, options?: CustomSendMessageOptions): Promise<SendMessageConvert> {
		const [textParse, entities] = this.client.messageParse._parseMessageText(this.client, content, options?.parseMode as string);
		if (options?.parseMode) delete options.parseMode;
		const result = await this.client.invoke(new Api.messages.SendMessage({
			peer: chatId,
			message: textParse,
			entities: options?.entities ? options?.entities : entities,
			...options
		}));
		return new SendMessageConvert(result as unknown as Api.Updates);
	}

	public async editMessage(chatId: string | number, messageId: number, content: string, options?: CustomEditMessageOptions): Promise<EditMessageConvert> {
		const [textParse, entities] = this.client.messageParse._parseMessageText(this.client, content, options?.parseMode as string);
		if (options?.parseMode) delete options.parseMode;
		const result = await this.client.invoke(new Api.messages.EditMessage({
			id: messageId,
			peer: chatId,
			entities,
			message: textParse,
			...options
		}));
		return new EditMessageConvert(result as unknown as Api.Updates);
	}

}