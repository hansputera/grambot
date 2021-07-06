import type { Api } from "telegram";
import type { TUser } from "typings";

export const senderConvert = (userObj: Api.User): TUser => {
	return {
		id: userObj.id,
		username: userObj.username,
		is_fake: userObj.fake,
		first_name: userObj.firstName,
		last_name: userObj.lastName,
		is_support: userObj.support,
		is_scam: userObj.scam,
		verified: userObj.verified,
		is_bot: userObj.bot,
		mutual_contact: userObj.mutualContact,
		restricted: userObj.restricted,
		phone_number: userObj.phone,
		language_code: userObj.langCode,
		photo: userObj.photo
	};
};