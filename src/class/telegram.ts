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

	public async getFullChat(chatId: number): Promise<Api.ChatFull> {
		const ent = await this.client.getEntity(chatId);
		if (ent.className == "Channel") {
			return (await this.client.invoke(new Api.channels.GetFullChannel({
				channel: ent.id
			}))).fullChat as Api.ChatFull;
		} else {
			return (await this.client.invoke(new Api.messages.GetFullChat({
				chatId: ent.id
			}))).fullChat as Api.ChatFull;
		}
	}

	public async canCreateVC(chatId: number): Promise<boolean> {
		return await new Promise((resolve) => {
			this.client.getEntity(chatId).then(e => {
				this.client.invoke(new Api.phone.CreateGroupCall({
					peer: e,
					randomId: Math.floor(Math.random() * 100),
					title: "Admin access test"
				})).catch(() => {
					return resolve(false);
				}).then((c) => {
					if (!c) return resolve(false);
					const call = ((c as Api.Updates).updates[0] as Api.UpdateGroupCall).call;
					this.client.invoke(new Api.phone.DiscardGroupCall({
						call: new Api.InputGroupCall({
							id: call.id,
							accessHash: call.accessHash
						})
					})).catch(() => {
						// no
					});
					return resolve(true);
				});
			});
		});
	}

	public async hasVoiceChat(chatId: number): Promise<boolean> {
		const fullChat = await this.getFullChat(chatId);
		if (!fullChat.call) return false;
		else return true;
	}
}