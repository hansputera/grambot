import type Client from "class/client";
import type Context from "class/context";
import type { Api } from "telegram";
import type { MessageIDLike } from "telegram/define";
import type { Message } from "telegram/tl/custom/message";
import { chatType } from "util/message";

export interface SendMessageOptions {
    noWebpage?: boolean;
    scheduleDate?: number;
    replyMarkup?: Api.TypeReplyMarkup;
    silent?: boolean;
    entities?: Api.TypeMessageEntity[];
    replyToMsgId?: MessageIDLike;
}

export interface EditMessageOptions {
    no_webpage?: boolean;
    peer: string | number;
    id: number;
    message: string;
    entities?: Api.TypeMessageEntity[];
    schedule_date?: number;
    reply_markup?: Api.TypeReplyMarkup;
    media?: Api.TypeInputMedia;
}

export interface CustomEditMessageOptions extends EditMessageOptions {
    parseMode?: ParseMode;
}

export interface CustomSendMessageOptions extends SendMessageOptions {
    parseMode?: ParseMode;
}

export type ParseMode = "markdown" | "html";
export type CallbackContext = (ctx: Context) => void;
export interface ClientEvents {
    command: (ctx: Context, { command, args }:{ command: string; args: string[]; }) => void;
    message: (ctx: Context) => void;
    error: (err: Error) => void;
}
export type CallbackError = (err: Error) => void;
export type EntityType = "bot_command" | "mention" | "hashtag" | "url" | "bold" | "italic" | "pre" | "code" | "text_url" | "mention_name" | "phone" | "cashtag" | "underline" | "strikethrough" | "blockquote" | "bank_card" | "unknown";
export interface TDocument {
    id: bigInt.BigInteger;
    docId: number;
    size: number;
    mime: string;
}

export interface TUser {
    id: number;
    username?: string;
    is_scam?: boolean;
    is_fake?: boolean;
    is_support?: boolean;
    is_bot?: boolean;
    first_name?: string;
    last_name?: string;
    verified?: boolean;
    restricted?: boolean;
    mutual_contact?: boolean;
    language_code?: string;
    phone_number?: string;
    photo?: Api.TypeUserProfilePhoto;
}

export interface TMessage {
    id: number;
    chatId?: number;
    text: string;
    date: number;
    chatType: chatType;
    via_bot: boolean;
    sticker?: TDocument;
    fromId?: number;
    entities?: {
        type: EntityType;
        offset: number;
        length: number;
    }[];
    sender: TUser;
    gram: Message;
}

export interface CommandProps {
    name: string;
    description: string;
    aliases: string[];
    ownerOnly?: boolean;
    cooldown?: number;
    category?: string;
    path?: string;
}

export interface CommandComponent {
    meta: CommandProps;
    run(ctx: Context, args: string[]): unknown;
    client?: Client;
}
/*
export interface InlineKeyboardButton {
    text: string;
    data: string;
    url?: string;
}

export interface CustomReplyMarkup {
    selective?: boolean;
    single_use?: boolean;
    resize?: boolean;
    rows: {
        buttons: InlineKeyboardButton[];
    }[];
}*/