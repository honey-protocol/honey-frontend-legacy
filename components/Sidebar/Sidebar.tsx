import React from 'react';
import {
  Box,
  Stack,
  Heading,
  Button,
  IconGrid,
  IconBookOpen,
  IconDocuments,
  IconHand,
  IconChevronRight,
  IconTokens,
  IconSplit,
  vars,
  IconLink,
  IconFlag,
  useTheme
} from 'degen';
import SidebarButton from '../SidebarButton';
import * as styles from './Sidebar.css';
import { DiscordIcon } from 'icons/DiscordIcon';
import { TwitterIcon } from 'icons/TwitterIcon';
import { MediumIcon } from 'icons/MediumIcon';
import { GithubIcon } from 'icons/GithubIcon';
import { useRouter } from 'next/router';
import { nextAccentMap } from 'helpers/theme-utils';

const feedbackUrl = 'https://feedback.honey.finance/';

const governanceUrl = 'https://forum.honey.finance/';

const mainLinks = [
  {
    url: '/',
    title: 'Dashboard',
    comingSoon: true,
    IconComp: IconGrid,
    key: 1
  },
  {
    url: '/loan',
    title: 'Loans',
    comingSoon: true,
    IconComp: IconSplit,
    key: 2
  },
  {
    url: '/farm',
    title: 'Farm',
    IconComp: IconTokens,
    key: 3
  },
  {
    url: '/governance',
    title: 'Governance',
    IconComp: IconHand,
    key: 4
  },
  {
    url: '/swap',
    title: 'Swap',
    IconComp: IconChevronRight,
    key: 5
  }
];

const bottomLinks = [
  {
    href: 'https://p2p.honey.finance',
    title: 'Honey P2P',
    IconComp: IconLink
  },
  {
    href: feedbackUrl,
    title: 'Feedback',
    IconComp: IconFlag
  },
  {
    href: 'https://docs.honey.finance/',
    title: 'Documentation',
    IconComp: IconBookOpen
  }
];

interface SidebarProps {
  showMobileSidebar: boolean;
}
const Sidebar = (props: SidebarProps) => {
  const router = useRouter();
  const pageName = router.route.split('/')[1];
  const { accent, setAccent } = useTheme();

  const toggleAccent = React.useCallback(() => {
    const nextAccent = nextAccentMap[accent];
    localStorage.setItem('accent', nextAccent);
    setAccent(nextAccent);
  }, [accent, setAccent]);

  return (
    <Box
      boxShadow="0.5"
      height="full"
      backgroundColor="backgroundTertiary"
      className={`${styles.sidebar} ${
        props.showMobileSidebar ? styles.sidebarMobile : ''
      }`}
    >
      <Stack flex={1} direction="vertical" justify="space-between">
        <Box
          borderBottomWidth="0.5"
          alignItems="center"
          display="flex"
          height="16"
        >
          <Button variant="transparent" onClick={toggleAccent}>
            <Heading as="h5" color="foreground" align="center" responsive>
              Honey Finance
            </Heading>
          </Button>
        </Box>
        <Stack>
          {mainLinks.map(link => {
            const isActive =
              link.url.split('/')[1].toLowerCase() === pageName.toLowerCase();
            return link.comingSoon ? (
              <Button
                as="a"
                variant="transparent"
                disabled={link.comingSoon}
                prefix={<link.IconComp />}
                size="small"
                width="full"
                justifyContent="flex-start"
                key={link.key}
              >
                {link.title}
              </Button>
            ) : (
              <SidebarButton
                isActive={isActive}
                key={link.key}
                url={link.url}
                title={link.title}
                iconComp={
                  <link.IconComp color={isActive ? 'accent' : 'textTertiary'} />
                }
              />
            );
          })}
        </Stack>
        <Box
          borderTopWidth="0.5"
          paddingTop="4"
          marginTop="auto"
          className={styles.bottomBox}
        >
          <Stack justify="space-around" space="8">
            <Stack>
              {bottomLinks.map((link, i) => (
                <Button
                  key={i}
                  as="a"
                  href={link.href}
                  target="_blank"
                  justifyContent="flex-start"
                  variant="transparent"
                  prefix={<link.IconComp />}
                  size="small"
                  width="full"
                >
                  {link.title}
                </Button>
              ))}
            </Stack>
            <Box paddingX="4" display="flex" justifyContent="space-between">
              <Stack direction="horizontal" justify="space-between" flex={1}>
                <Button
                  as="a"
                  href="https://discord.gg/honeydefi"
                  target="_blank"
                  size="small"
                  variant="secondary"
                  shape="square"
                >
                  <DiscordIcon color={vars.colors.accent} />
                </Button>
                <Button
                  as="a"
                  href="https://twitter.com/honeydefi"
                  target="_blank"
                  size="small"
                  variant="secondary"
                  shape="square"
                >
                  <TwitterIcon color={vars.colors.accent} />
                </Button>
                <Button
                  as="a"
                  href="https://blog.honey.finance"
                  target="_blank"
                  size="small"
                  variant="secondary"
                  shape="square"
                >
                  <MediumIcon color={vars.colors.accent} />
                </Button>
                <Button
                  as="a"
                  href="https://github.com/honey-labs"
                  target="_blank"
                  size="small"
                  variant="secondary"
                  shape="square"
                >
                  <GithubIcon color={vars.colors.accent} />
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Sidebar;
