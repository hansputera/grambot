import "dotenv/config";

const API_ID   = process.env.API_ID;
const API_HASH = process.env.API_HASH;
const PHONE_NUMBER = process.env.PHONE_NUMBER;
const SESSION = process.env.SESSION;
const TOKEN = process.env.TOKEN;

// validation
if (!API_ID || !/^[0-9]{7}$/.test(API_ID as string)) throw new Error("Invalid API_ID");
if (!API_HASH || !/^[a-zA-Z0-9]{32}$/.test(API_HASH as string)) throw new Error("Invalid API_HASH");
if (!TOKEN && PHONE_NUMBER && !/^[+]?\d+.$/.test(PHONE_NUMBER as string)) throw new Error("Invalid Phone Number");
if (!SESSION) throw new Error("Missing SESSION");

export default {
	API_ID, API_HASH, PHONE_NUMBER, SESSION, TOKEN
};