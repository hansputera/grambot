import type Client from "../../class/client";
import type Context from "../../class/context";
import { Command } from "../../decors";
import type { CommandComponent, CommandProps } from "typings";
import DevUtil from "../../util/dev";
import { inspect } from "util";

@Command({
	name: "eval",
	description: "Evaluate js code",
	aliases: ["ev", "evaluate", "evaljs"],
	category: "dev",
	path: __filename,
	ownerOnly: true
})
export default class EvalCommand implements CommandComponent {
	constructor(public client: Client, public meta: CommandProps) {}
	public async run(ctx: Context, args: string[]): Promise<void> {
		const { args: Args, flags } = DevUtil.parseQuery(args);
		let code = Args.join(" ");
		if (!code.length) {
			await ctx.replyWithMarkdown("Please enter **javascript code**");
			return;
		}
		let depth = 0;
		if (flags.includes("async")) {
			code = `(async() => {
                    ${code}
                })()`;
		}
		if (flags.some(flag => flag.includes("depth"))) {
			depth = parseInt((flags.find(flag => flag.includes("depth")) as string).split("=")[1], 10);
		}
		try {
			const parseval = await DevUtil.parseEval(eval(code));
			if (flags.includes("silent")) return;
			if (typeof parseval.evaled !== "string") parseval.evaled = inspect(parseval.evaled, { depth });
			if (parseval.evaled.length > 5000) {
				await ctx.replyWithMarkdown((await DevUtil.hastebin(parseval.evaled)).url);
				return;
			} else {
				await ctx.replyWithMarkdown(`\`\`\`${parseval.evaled}\`\`\`\n\nType: \`${parseval.type}\``, { replyToMsgId: ctx.message.id });
			}
		} catch (e) {
			await ctx.replyWithMarkdown(`\`\`\`${e}\`\`\``, { replyToMsgId: ctx.message.id });
			return;
		}
	}
}