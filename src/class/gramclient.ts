/* eslint-disable no-mixed-spaces-and-tabs */
import env from "../env";
import inquirer from "inquirer";
import { Api, TelegramClient } from "telegram";
import { StoreSession } from "telegram/sessions";
import { NewMessage, NewMessageEvent } from "telegram/events";
import TelegramAPI from "./telegram";
import Context from "./context";
import type { CallbackContext, CallbackError, TMessage } from "typings";
import { messageConvert } from "../util/message";
import * as messageParse from "telegram/client/messageParse";
import Signal from "../signal";

const signal = Signal;
const session = new StoreSession(env.SESSION);
export default class GramClient extends TelegramClient {
	public messageParse = messageParse;
    public telegram = new TelegramAPI(this);
    constructor() {
    	super(session, Number(env.API_ID), env.API_HASH, {
    		langCode: "en",
    		autoReconnect: true
    	});
    }

    public onNewMessage(callback: CallbackContext): void {
    	this.addEventHandler(async (event: NewMessageEvent) => {
    		const convMessage = await messageConvert(event);
    		const context = new Context(this, convMessage as TMessage);
    		return callback(context);
    	}, new NewMessage({}));
    }

    public onRawUpdate(): void {
    	this.addEventHandler((api: Api.TypeUpdates) => {
    		// deteksi bot
    		if (api.classType == "constructor") {
    			if (api.className == "UpdateGroupCallParticipants") {
    				const apiUpdateCall = (api as Api.UpdateGroupCallParticipants);
    				const me = apiUpdateCall.participants.find(p => p.self);
    				if (me && me.muted) {
    					signal.emit("botMutedInCall", me);
    				}
    			} else if (api.className == "UpdateUserStatus") {
    				const apiUpdateUser = (api as Api.UpdateUserStatus);
					
    				// if (apiUpdateUser.className == "UserStatusOnline") apiUpdateUser.status = (apiUpdateUser.status as Api.UserStatusOnline);
    				// else if (apiUpdateUser.className == "UserStatusOffline") apiUpdateUser.status = (apiUpdateUser.status as Api.UserStatusOffline);
    				// else if (apiUpdateUser.className == "UserStatusRecently") apiUpdateUser.status = (apiUpdateUser.status as Api.UserStatusRecently);
    				// else if (apiUpdateUser.className == "UserStatusLastMonth") apiUpdateUser.status = (apiUpdateUser.status as Api.UserStatusLastMonth);
    				// else if (apiUpdateUser.className == "UserStatusLastWeek") apiUpdateUser.status = (apiUpdateUser.status as Api.UserStatusLastWeek);

    				signal.emit("userStatusUpdate", {
    					id: apiUpdateUser.userId,
    					status: apiUpdateUser.status
    				});
    			} else if (api.className == "UpdateGroupCall" && (api as Api.UpdateGroupCall).call.className == "GroupCallDiscarded") {
    				const res = (api as Api.UpdateGroupCall);
    				signal.emit("groupVoiceEnded", res.chatId, (res.call as Api.GroupCallDiscarded).duration);
    			}
    		}
    	});
    }

    public onError(callback: CallbackError): void {
    	process.on("uncaughtException", callback);
    }

    public launch(): Promise<void> {
    	return this.start(env.TOKEN ? {
    		botAuthToken: env.TOKEN,
    	} : {
    		phoneNumber: env.PHONE_NUMBER as string,
    		onError: (err) => console.error(err),
    		password: async () => {
    			return await new Promise((resolve) => {
    				inquirer.prompt({
    					name: "pwd",
    					message: "Masukan password",
    					type: "password",
    				}).then((x) => {
    					resolve(x.pwd);
    				});
    			});
    		},
    		phoneCode: async(): Promise<string> => {
    			return await new Promise((resolve) => {
    				inquirer.prompt({
    					name: "code",
    					message: "Masukan kode verifikasi",
    					type: "input"
    				}).then((x) => {
    					resolve(x.code);
    				});
    			});
    		}
    	});
    }
}