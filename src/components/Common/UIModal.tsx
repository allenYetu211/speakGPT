/*
 * @Author: Allen OYang
 * @Email:  allenwill211@gmail.com
 * @Date: 2023-05-03 08:06:57
 * @LastEditTime: 2023-05-05 16:41:30
 * @LastEditors: Allen OYang allenwill211@gmail.com
 * @FilePath: /nova-gpt/src/components/Common/UIModal.tsx
 */
import { UICard, UICardProps } from '@/components/Common/UICard';
import { FC } from 'react';
import { Modal, createStyles, ModalProps } from '@mantine/core';

interface UIModalProps extends UICardProps, ModalProps {
	cardProps?: UICardProps;
}

const useStyles = createStyles((theme) => ({
	modalContainer: {
		[`&.mantine-Modal-body`]: {
			background: theme.colors.dark[6],
			height: '100vh',
		},
		// [`& .card-container`]: {
		// 	padding: `${theme.radius.xs} ${theme.radius.xl}`,
		// },
		[`& .card-utils`]: {
			padding: `${theme.radius.xs} ${theme.radius.xl}`,
		},
		[`& .card-box-container`]: {
			padding: `${theme.radius.xs} ${theme.radius.xl}`,
			minHeight: `80px`,
			display: 'flex',
			justifyItems: 'center',
			alignItems: 'center',
			width: '100%',
		},
	},
}));

export const UIModal: FC<UIModalProps> = (props) => {
	const { classes, theme } = useStyles();
	const { children, container, cardBoxStyles, ...other } = props;
	return (
		<Modal
			className={classes.modalContainer}
			withCloseButton={false}
			radius={theme.radius.xl}
			padding={0}
			{...other}
			// overlayProps={{
			// 	style: {
			// 		height: '100vh',
			// 	},
			// }}
		>
			<UICard container={container} cardBoxStyles={cardBoxStyles}>
				{children}
			</UICard>
		</Modal>
	);
};
