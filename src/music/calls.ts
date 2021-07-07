/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-mixed-spaces-and-tabs */
import Client from "../class/client";
import { Api } from "telegram";
import type { JoinVoiceCallParams } from "tgcalls/lib/types";

export default class CallsClient {
    public calls: Record<string, Api.InputGroupCall> = {};
    
    constructor(public client: Client) {}
    async joinCall(chatid: number, params: JoinVoiceCallParams<Record<string, unknown>>) {
    	if (!(chatid in this.calls)) {
    		const entity = await this.client.gramjs.getEntity(chatid);
    		const fullChat = (await this.client.gramjs.invoke(new Api.messages.GetFullChat({
    			chatId: entity.id
    		}))).fullChat;
    		if (!fullChat) throw new Error("No voice chat");
    		this.calls[chatid] = fullChat.call as Api.InputGroupCall;
    	}

    	const res = (((
                (await this.client.gramjs.invoke(
    				new Api.phone.JoinGroupCall({
    					muted: false,
    					call: this.calls[chatid],
    					params: new Api.DataJSON({
    						data: JSON.stringify({
    							ufrag: params.ufrag,
    							pwd: params.pwd,
    							fingerprints: [
    								{
    									hash: params.hash,
    									setup: params.setup,
    									fingerprint: params.fingerprint
    								}
    							],
    							ssrc: params.source
    						})
    					}),
    					joinAs: "me"
    				})
    			)) as Api.Updates).updates[0] as Api.UpdateGroupCall).call as Api.GroupCall).params?.data;
    	return JSON.parse(res as string);
    }

    async leaveCall(chatId: number): Promise<boolean> {
    	if (chatId in this.calls) {
    		await this.client.gramjs.invoke(new Api.phone.LeaveGroupCall({
    			call: this.calls[chatId], source: 0
    		}));
    		return true;
    	} else return false;
    }
}