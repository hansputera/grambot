/* eslint-disable no-mixed-spaces-and-tabs */
import { Api } from "telegram";
import type { NewMessageEvent } from "telegram/events";
import type { TMessage } from "typings";
import { senderConvert } from "./user";

export class SendMessageConvert {
    id!: number;
    chatId!: number;
    date!: number;
    constructor(apiResult: Api.Updates) {
    	if (apiResult.updates) {
    		const updates = apiResult.updates as Api.UpdateMessageID[];
    		if (updates.length && updates[0].id) {
    			this.id = updates[0].id;
    		}

    		if (apiResult.chats.length) {
    			this.chatId = apiResult.chats[0].id;
    		}
    	} else {
    		const noUpdatesApiResult = apiResult as unknown as Api.UpdateShortSentMessage;
    		this.id = noUpdatesApiResult.id;
    	}

    	this.date = apiResult.date || Date.now()/1000;
    }
}

export type chatType = "private" | "channel" | "group" | "unknown";

export const getChatType = (msg: NewMessageEvent): chatType => {
	if (msg.isPrivate) return "private";
	else if (msg.isChannel) return "channel";
	else if (msg.isGroup) return "group";
	else return "unknown";
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const messageConvert = async (msg: NewMessageEvent) => {
	const sender = await msg.message.getSender();
	return {
		id: msg.message.id,
		chatId: msg.chatId,
		text: msg.message.text,
		date: msg.message.date as number || Date.now()/1000,
		chatType: getChatType(msg),
		via_bot: msg.message.viaBot ? true : false,
		sticker: msg.message.sticker ? {
			id: msg.message.sticker.id,
			docId: msg.message.sticker.dcId,
			size: msg.message.sticker.size,
			mime: msg.message.sticker.mimeType
		} : undefined,
		fromId: msg.message.senderId,
		entities: msg.message.entities,
		sender: senderConvert(sender as Api.User)
	};
};

export const parseCommand = (text: string, entities: TMessage["entities"]): { command: string; args: string[]; } | undefined => {
	const botCommand = entities?.find(e => e.type == "bot_command");
	if (!botCommand) return undefined;
	const command = text.slice(botCommand.offset, botCommand.length);
	const args = text.replace(command, "").trim().split(/ +/g);
	return { command: command.slice(1), args };
};