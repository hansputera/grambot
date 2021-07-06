/* eslint-disable no-mixed-spaces-and-tabs */
import type Client from "../../class/client";
import type Context from "../../class/context";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "typings";
import type { SendMessageConvert } from "../../util/message";

@Command({
	name: "ping",
	description: "Ping pong",
	aliases: ["pong", "pinkpong"],
	path: __filename
})
export default class PingCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}
	public async run(ctx: Context): Promise<SendMessageConvert> {
		return await ctx.reply("Pong!", {
			replyMarkup: new this.client.Api.ReplyKeyboardMarkup({
				rows: [new this.client.Api.KeyboardButtonRow({
					buttons: [
						new this.client.Api.KeyboardButton({
						    text: "A"
					    })
					],
				})],
				selective: true,
			}),
		});
	}
}