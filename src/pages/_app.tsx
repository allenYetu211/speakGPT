/*
 * @Author: Allen OYang
 * @Email:  allenwill211@gmail.com
 * @Date: 2023-04-14 11:27:09
 * @LastEditTime: 2023-04-29 19:41:10
 * @LastEditors: Allen OYang allenwill211@gmail.com
 * @FilePath: /nova-gpt/src/pages/_app.tsx
 */
import '@/styles/globals.css';
import '@/styles/Markdown.css';

import { Nav } from '@/components/Nav';
import { ThemeColor } from '@/models/ThemeColor';
import { AppShell, Box, createStyles, Header, MantineProvider, Loader } from '@mantine/core';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect, useState } from 'react';

const useStyles = createStyles((theme) => ({
	appShell: {
		[`@media (max-width: ${theme.breakpoints.sm})`]: {
			// paddingLeft: 500,
		},

		// [`.mantine-AppShell-main`]: {
		//   [`@media (max-width: ${theme.breakpoints.sm})`]: {
		//     paddingLeft: 0,
		//   },
		// },
		// [`.mantine-Navbar-root`]: {
		//   [`@media (max-width: ${theme.breakpoints.sm})`]: {
		//     width: '100%',
		//     opacity: 0,
		//   },
		// },
	},
}));

export default function App({ Component, pageProps }: AppProps) {
	const [isHydrated, setIsHydrated] = useState(false);
	const { classes, theme } = useStyles();
	//Wait till NextJS rehydration completes
	useEffect(() => {
		setIsHydrated(true);
	}, []);

	if (!isHydrated) {
		return (
			<div
				style={{
					width: '100vw',
					height: '100vh',
					backgroundColor: theme.colors.dark[6],
				}}
			>
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						transform: 'translate(-50%, -50%)',
					}}
				>
					<Loader size="xs" color="grape" variant="bars" />
				</div>
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>Nova GPT</title>
				<meta name="description" content="Extension Chat GPT WEB" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* <link rel="icon" href="/favicon.ico" /> */}
				<link rel="icon" type="image/svg+xml" href="/logo.svg" />
			</Head>

			<MantineProvider
				withGlobalStyles
				withNormalizeCSS
				theme={{
					/** Put your mantine theme override here */
					colorScheme: 'dark',
					colors: ThemeColor,
				}}
			>
				<AppShell
					className={classes.appShell}
					padding="md"
					layout="alt"
					navbar={<Nav />}
					styles={(theme) => ({
						main: {
							background:
								theme.colorScheme === 'dark' ? theme.colors.gradient[0] : theme.colors.gray[0],
							[`@media (max-width: ${theme.breakpoints.sm})`]: {
								paddingLeft: '1rem',
							},
						},
					})}
				>
					<Box
						sx={{
							height: `calc(100vh - 3rem)`,
						}}
					>
						<Component {...pageProps} />
					</Box>
				</AppShell>
			</MantineProvider>
		</>
	);
}
