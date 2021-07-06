/* eslint-disable @typescript-eslint/no-explicit-any */
import * as Modules from "./class/modules";
import type { CommandProps } from "typings";

export function Command(args: CommandProps) {
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	return function (target: any) {
		args.aliases.forEach(alias => {
			Modules.aliases.set(alias, args.name);
		});
		Modules.commands.set(args.name, { run: new target(undefined, args).run, meta: args });  
	};
}