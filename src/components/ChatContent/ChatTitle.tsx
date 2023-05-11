import { changeActionChat } from '@/stores/ChatAction';
import { Chat, Message, useChatStore } from '@/stores/ChatStore';
import { Menu, Box, Flex, Group, Input, Text, Title, createStyles } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconShare, IconMarkdown, IconPng } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRef } from 'react';
import { UIModal, UIButton, UIActionButton, modal } from '@/components/Common';
import i18n from '@/i18n';
import { downloadAsCapture, downloadAsMarkdown } from '@/utils/download';
import { copyToClipboard } from '@/utils';
import { notifications } from '@mantine/notifications';

const useStyles = createStyles((theme) => ({
	titleContainer: {
		// border: theme.other.border01,
		// borderWidth: `0 0 0.1rem 0`,
		right: theme.spacing.md,
		color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[9],
		padding: `5px ${theme.spacing.md}`,
	},

	changeTitleInput: {
		width: '100%',
		// [`& .mantine-Input-input`]: {
		// 	flex: 1,
		// 	border: `none`,
		// 	backgroundColor: 'transparent',
		// },
	},
}));

interface ChatTitlesContainerUIProps {
	message: Message[];
	chat: Chat;
	share?: boolean;
}

export function ChatTitlesContainer(props: ChatTitlesContainerUIProps) {
	const { message, chat, share = false } = props;
	const { classes } = useStyles();
	const inputValue = useRef<string>('');

	const download = (type: 'png' | 'md') => {
		if (!message.length) {
			return;
		}

		const time = dayjs(chat.created_at).format('YYYY/MM/DD HH:mm:ss');

		if (type === 'png') {
			downloadAsCapture(`${chat.title}-${time}.png`, {
				title: chat.title,
				time,
			});
		} else {
			console.log('downloadAsMarkdown');
			downloadAsMarkdown(message, `${chat.title}-${time}.md`);
		}
	};

	const onOpenEditModal = () => {
		modal.open({
			id: 'changeEdit',
			title: i18n.changeTitle,
			children: (
				<Flex
					gap={10}
					sx={() => ({
						width: '100%',
					})}
				>
					<Input
						className={classes.changeTitleInput}
						defaultValue={chat.title}
						placeholder={i18n.changeTitlePlaceholder}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
							inputValue.current = e.target.value;
						}}
					/>

					<UIButton
						onClick={() => {
							changeActionChat(chat.id, {
								title: inputValue.current,
							});
							modal.closeAll();
							// modal.close('changeEdit');
						}}
					>
						{i18n.confirm}
					</UIButton>
				</Flex>
			),
		});
	};

	return (
		<>
			<Group position="apart" className={classes.titleContainer}>
				<Box>
					<Title order={5}>{chat.title}</Title>
					<Text fz="xs">{dayjs(chat.created_at).format('YYYY/MM/DD HH:mm:ss')}</Text>
				</Box>

				<Group sx={{ position: 'relative' }}>
					<ShareChatHistory download={download} share={share} />
					{!share && (
						<UIActionButton onClick={onOpenEditModal}>
							<IconEdit />
						</UIActionButton>
					)}
				</Group>
			</Group>
		</>
	);
}

function ShareChatHistory({
	download,
	share,
}: {
	download: (type: 'png' | 'md') => void;
	share: boolean;
}) {
	return (
		<Menu trigger="hover" shadow="md" width={200}>
			<Menu.Target>
				<UIActionButton>
					<IconShare />
				</UIActionButton>
			</Menu.Target>

			<Menu.Dropdown>
				<Menu.Label>Download Content</Menu.Label>
				<Menu.Item
					onClick={() => {
						download('md');
					}}
					icon={<IconMarkdown size={14} />}
				>
					Markdown
				</Menu.Item>

				<Menu.Item
					onClick={() => {
						download('png');
					}}
					icon={<IconPng size={14} />}
				>
					Picture
				</Menu.Item>

				{!share && (
					<>
						<Menu.Label>Share</Menu.Label>
						<Menu.Item
							onClick={() => {
								const regex = /\/chat\//;
								const replacedStr = window.location.href.replace(regex, '/share/');
								copyToClipboard(replacedStr);

								notifications.show({
									title: `Share Link Copied`,
									message: replacedStr,
									color: 'rgb(190, 75, 219)',
									autoClose: 5000,
								});
							}}
							icon={<IconShare size={14} />}
						>
							Share Link
						</Menu.Item>
					</>
				)}
			</Menu.Dropdown>
		</Menu>
	);
}
