import type { Api } from "telegram";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getEntityType = (entity: Api.TypeMessageEntity) => {
	switch(entity.className) {
	case "MessageEntityBotCommand":
		return "bot_command";
	case "MessageEntityMention":
		return "mention";
	case "MessageEntityHashtag":
		return "hashtag";
	case "MessageEntityUrl":
		return "url";
	case "MessageEntityBold":
		return "bold";
	case "MessageEntityItalic":
		return "italic";
	case "MessageEntityPre":
		return "pre";
	case "MessageEntityCode":
		return "code";
	case "MessageEntityTextUrl":
		return "text_url";
	case "MessageEntityMentionName":
		return "mention_name";
	case "MessageEntityPhone":
		return "phone";
	case "MessageEntityCashtag":
		return "cashtag";
	case "MessageEntityUnderline":
		return "underline";
	case "MessageEntityStrike":
		return "strikethrough";
	case "MessageEntityBlockquote":
		return "blockquote"; 
	case "MessageEntityBankCard":
		return "bank_card";
	default:
		return "unknown";
	}
};
