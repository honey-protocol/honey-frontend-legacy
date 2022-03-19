import React from 'react';
import Link from 'next/link';
import { Button, Text } from 'degen';
import { ReactNodeNoStrings } from 'degen/dist/types/types';

interface ButtonData {
  url: string;
  title: string;
  isActive: boolean;
  iconComp?: ReactNodeNoStrings;
}
const SidebarButton = (props: ButtonData) => {
  return (
    <Link href={props.url} passHref>
      <Button
        as="a"
        variant="transparent"
        prefix={props.iconComp}
        size="small"
        width="full"
        justifyContent="flex-start"
      >
        <Text color={props.isActive ? 'accent' : 'textTertiary'}>
          {props.title}
        </Text>
      </Button>
    </Link>
  );
};

export default SidebarButton;
