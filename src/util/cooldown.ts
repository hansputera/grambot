import MyMap from "../class/map";

export const cooldowns: MyMap<string, MyMap<number, number>> = new MyMap();
const cooldownSend: MyMap<number, boolean> = new MyMap();

export default function Cooldown(command: string, cooldownNum: number, userId: number): { timeLeft: number; } | undefined {
	if (!cooldowns.has(command)) cooldowns.set(command, new MyMap());
	const now = Date.now();
	const timestamps = cooldowns.get(command);
	if (!timestamps?.has(userId)) timestamps?.set(userId, now);
	else {
		const expirationTime = timestamps.get(userId) as number + cooldownNum;
		if (now < expirationTime && !cooldownSend.has(userId)) {
			const timeLeft = (expirationTime - now) / 1000;
			cooldownSend.set(userId, true);
			return { timeLeft };
		}
		timestamps.set(userId, now);
		setTimeout(() => {
			timestamps.delete(userId);
			cooldownSend.delete(userId);
		}, cooldownNum);
	}
}