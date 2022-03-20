import React from 'react';
import {
  Box,
  Stack,
  Heading,
  Button,
  IconGrid,
  IconUsersSolid,
  IconPencil,
  IconCode,
  IconCollection,
  IconBookOpen,
  IconDocuments,
  IconHand,
  IconTokens,
  IconSplit,
  vars,
  IconLink
} from 'degen';
import SidebarButton from '../SidebarButton';
import * as styles from './Sidebar.css';
import { ReactNodeNoStrings } from 'degen/dist/types/types';
import { DiscordIcon } from 'icons/DiscordIcon';
import { TwitterIcon } from 'icons/TwitterIcon';
import { MediumIcon } from 'icons/MediumIcon';
import { GithubIcon } from 'icons/GithubIcon';
import { useRouter } from 'next/router';

const whitePaperUrl =
  'https://4291845233-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FLxClA4ViEZ3CcRvINtyy%2Fuploads%2FsDr0JNKhTU5H9f9qkkX2%2Fhoney_whitepaper.pdf?alt=media&token=c9054e88-e3a5-43fd-a80f-ac55e2d49162';

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
    url: '/lend',
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
  }
];

const bottomLinks = [
  {
    href: 'https://docs.honey.finance/',
    title: 'Documentation',
    IconComp: IconBookOpen
  },
  {
    href: whitePaperUrl,
    title: 'Whitepaper',
    IconComp: IconDocuments
  },
  {
    href: 'https://honeylend.netlify.app/farm',
    title: 'Legacy website',
    IconComp: IconLink
  }
];

interface SidebarProps {
  showMobileSidebar: boolean;
}
const Sidebar = (props: SidebarProps) => {
  const router = useRouter();
  const pageName = router.route.split('/')[1];

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
          <Heading as="h5" color="foreground" align="center" responsive>
            Honey Finance
          </Heading>
        </Box>
        <Stack>
          {mainLinks.map((link, i) => {
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
          <Button
            as="a"
            href={governanceUrl}
            target="_blank"
            variant="transparent"
            prefix={<IconHand />}
            size="small"
            width="full"
            justifyContent="flex-start"
          >
            Governance
          </Button>
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
