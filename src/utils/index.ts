/*
 * @Author: Allen OYang
 * @Email:  allenwill211@gmail.com
 * @Date: 2023-04-19 23:58:12
 * @LastEditTime: 2023-04-29 19:14:17
 * @LastEditors: Allen OYang allenwill211@gmail.com
 * @FilePath: /nova-gpt/src/utils/index.ts
 */
import { Chat } from '@/stores/ChatStore';
import { notifications } from '@mantine/notifications';

export function keepDecimal(num: number, decimal: number) {
	return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
}

export function updateActionsChatMessage(
	chats: Chat[],
	id: string,
	callback: (message: Chat['message']) => Chat['message'],
) {
	return chats.map((chat) => {
		if (chat.id === id) {
			chat.message = callback(chat.message);
		}
		return chat;
	});
}

export const getActiveChat = (chats: Chat[], id: string) => {
	return chats.find((chat) => chat.id === id);
};

export const copyToClipboard = async (text: string) => {
	console.log('text', text);
	try {
		await navigator.clipboard.writeText(text);
		notifications.show({
			message: 'Copy Success!',
			color: 'green',
		});
	} catch (error) {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();
		try {
			document.execCommand('copy');
			notifications.show({
				message: 'Copy Success!',
				color: 'green',
			});
		} catch (error) {
			// showToast(Locale.Copy.Failed);
			notifications.show({
				message: 'Copy Failed!',
				color: 'red',
			});
		}
		document.body.removeChild(textArea);
	}
};
