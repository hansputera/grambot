import { Api } from "telegram";
import { SendMessageConvert } from "../util/message";
import type { CustomSendMessageOptions } from "../typings";
import type GramClient from "./gramclient";

export default class TelegramAPI {
	constructor(public client: GramClient) {}
    
	public async sendMessage(chatId: string | number, content: string, options?: CustomSendMessageOptions): Promise<SendMessageConvert> {
		const [textParse, entities] = await this.client._parseMessageText(content, options?.parseMode);
		if (options?.parseMode) delete options.parseMode;
		const result = await this.client.invoke(new Api.messages.SendMessage({
			peer: chatId,
			message: textParse,
			entities: options?.entities ? options?.entities : entities,
			...options
		}));
		return new SendMessageConvert(result as unknown as Api.Updates);
	}
}