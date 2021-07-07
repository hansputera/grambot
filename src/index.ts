import Cooldown from "./util/cooldown";
import Client from "./class/client";
const ownerID = 1803044735;

const bot = new Client();
bot.launch();

bot.on("command", async (ctx, { command, args }) => {
	bot.socket_app.app.emit("commandTry", { command, from: { id: ctx.message.sender.id, username: ctx.message.sender.username} });
	const cmd = bot.commands.search(command) || bot.commands.get(bot.aliases.get(command) as string);
	if (!cmd) return;

	const cooldown = Cooldown(cmd.meta.name, cmd.meta.cooldown as number, ctx.message.sender.id);
	if (cooldown) return await ctx.replyWithMarkdown("Please wait for `" + cooldown.timeLeft.toFixed(2) + "` seconds. You're in cooldown period.");
	if (cmd.meta.ownerOnly && ctx.message.sender.id != ownerID) return;
	await cmd.run(ctx, args);
});
