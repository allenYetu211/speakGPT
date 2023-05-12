/*
 * @Author: Allen OYang
 * @Email:  allenwill211@gmail.com
 * @Date: 2023-04-18 12:36:37
 * @LastEditTime: 2023-05-12 11:51:55
 * @LastEditors: Allen OYang allenwill211@gmail.com
 * @FilePath: /nova-gpt/src/stores/ChatAction.ts
 */
import i18n from '@/i18n';
import type { RolePlayType } from '@/role';
import { createMessage } from '@/utils';
import { v4 as uuidv4 } from 'uuid';
import { Chat, ChatState, useChatStore } from './ChatStore';
import { NextRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const setChat = useChatStore.setState;

export const update = (newState: Partial<ChatState>) => setChat(() => newState);

export const newChat = (router: NextRouter, role?: RolePlayType) => {
	const id = uuidv4();

	let defaultInitChat: Chat = {
		id,
		message: [
			createMessage({
				message: i18n.chat.firstQuestion,
				role: 'assistant',
				loading: false,
				exception: false,
			}),
		],
		avatar: '🤖',
		userAvatar: '😁',
		systemAvatar: '👩🏻‍🏫',
		created_at: new Date(),
		title: 'New Session',
	};

	if (role) {
		const { message, ...other } = role;
		defaultInitChat = Object.assign(defaultInitChat, {
			message: [Object.assign(defaultInitChat.message[0], role.message)],
			...other,
		});
	}

	setChat((state) => ({
		activeChatId: id,
		chats: state.chats.concat(defaultInitChat),
	}));

	// router.push(`/chat/${id}`);

	supabase.insert('chat', [
		{
			id,
			created_at: defaultInitChat.created_at,
			title: defaultInitChat.title,
			avatar: defaultInitChat.avatar || '🤖',
			// userAvatar: defaultInitChat.userAvatar ||  '',
			// systemAvatar: defaultInitChat.systemAvatar ||  '👩🏻‍🏫',
		},
	]);
};

export const setActiveChatId = (id: string | undefined) => {
	setChat(() => ({
		activeChatId: id || '',
	}));
};

export const deleteChat = (id: string) => {
	setChat((state) => {
		let chats = state.chats.filter((chat) => chat.id !== id);
		let activeChatId = chats.length > 0 ? chats[chats.length - 1].id : '';
		return {
			activeChatId,
			chats,
		};
	});
};

export const changeActionChat = (id: string, newTitle?: Partial<Omit<Chat, 'message'>>) => {
	if (!newTitle) return;
	setChat((state) => ({
		chats: state.chats.map((chat) => {
			if (chat.id === id) {
				chat = { ...chat, ...newTitle };
			}
			return chat;
		}),
	}));
};
