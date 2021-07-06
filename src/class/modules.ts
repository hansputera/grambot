import { readdir } from "fs";
import { join } from "path";
import type { CommandComponent } from "typings";
import type GramClient from "./gramclient";
import MyMap from "./map";

export const commands: MyMap<string, CommandComponent> = new MyMap();
export const aliases: MyMap<string, string> = new MyMap();

export default class Modules {
	constructor(public client: GramClient,readonly path: string) {}
	public load(): void {
		readdir(this.path, (err, categories) => {
			if (err) throw new Error(err.message);
			console.info(`Found ${categories.length} categories`);
			categories.forEach(category => {
				readdir(join(this.path, category), (errr, files) => {
					if (err) throw new Error(errr?.message);
					console.info(`Found ${files.length} commands from '${category}'`);
					files.filter(fl => fl.endsWith(".js")).forEach(fl => {
						const pathFl = join(this.path, category, fl);
						// eslint-disable-next-line @typescript-eslint/no-var-requires
						const prop: CommandComponent = new (require(pathFl).default)(this, {
							path: pathFl
						});
						commands.set(prop.meta?.name as string, prop);
					});
				});
			});
		});
	}
}