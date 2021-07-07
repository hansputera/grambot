import http from "http";
import Server from "socket.io";
import type Client from "./client";

export default class Socket {
	constructor(public client: Client) {
		this.server.listen(3000, "0.0.0.0");
	}

    public server = http.createServer();
    public app = new Server.Server(this.server);
}