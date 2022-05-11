import { Box, Text } from 'degen';
import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type CommonProps<T> = InputHTMLAttributes<T> & TextareaHTMLAttributes<T>;

interface Props<T extends HTMLElement> extends CommonProps<T> {
  Component: React.FC<CommonProps<T>>;
  label: string;
  error?: string;
  touched?: boolean;
  footer?: React.ReactNode;
}

export const LabeledInput = <T extends HTMLElement>({
  id,
  label,
  Component,
  error,
  touched,
  footer,
  ...commonProps
}: Props<T>) => {
  return (
    <Box as="label" display="flex" flexDirection="column" gap="1" htmlFor={id}>
      <Text size="small">{label}</Text>
      <Component
        {...commonProps}
        id={id}
        // css={[touched && error && tw`ring-1 ring-red-500`]}
      />
      {touched && error && (
        <Text as="span" size="small" color="red">
          {error}
        </Text>
      )}
      {footer !== undefined && (
        <Text as="span" size="small">
          {footer}
        </Text>
      )}
    </Box>
  );
};
