import { style } from '@vanilla-extract/css';
import {
  Box,
  IconCheck,
  IconChevronDown,
  IconChevronUp,
  Stack,
  Text
} from 'degen';
import React, { useState } from 'react';
import * as styles from './CustomDropdown.css';

type Option = {
  value: string;
  title: string;
};

interface CustomDropdownProps {
  options: Option[];
  onChange: (value: string) => void;
}

const CustomDropdown = (props: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(props.options[0]);
  const onSelect = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    props.onChange(option.value);
  };
  const onOpen = () => {};
  const onClose = () => {};
  return (
    <Box className={styles.dropdown}>
      <Box
        onClick={() => setIsOpen(!isOpen)}
        className={styles.dropdownFilterSelected}
      >
        <Stack direction="horizontal" justify="space-between">
          <Text>{selectedOption.title}</Text>
          {!isOpen ? <IconChevronDown /> : <IconChevronUp />}
        </Stack>
      </Box>
      <Box
        display={isOpen ? 'block' : 'none'}
        className={styles.dropdownSelect}
      >
        {props.options.map(
          (option, i) =>
            option.title.length > 0 &&
            option.value.length > 0 && (
              <Box
                onClick={() => onSelect(option)}
                key={option.value}
                className={styles.dropdownSelectOption}
              >
                <Stack direction="horizontal" justify="space-between">
                  <Text size="small">{option.title}</Text>
                  {option.value === selectedOption.value && <IconCheck />}
                </Stack>
              </Box>
            )
        )}
      </Box>
    </Box>
  );
};

export default CustomDropdown;
