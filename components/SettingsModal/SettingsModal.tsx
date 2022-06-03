import React, { useState } from 'react';
import { Box, Button, Stack, Text, useTheme } from 'degen';

import * as styles from './SettingsModal.css';
import { Accent, Mode } from 'degen/dist/types/tokens';
import { accents, modes } from 'helpers/theme-utils';
import { Language, languages } from 'helpers/languageUtils';
import { accentLocalKey, languageLocalKey, modeLocalKey } from 'constants/local-storage';

const SettingsModal = () => {
  const { accent, setAccent, mode, setMode } = useTheme();
  const [language, setLanguage] = useState<string>('en-US');

  const locallyStore = (key: string, value: string) => localStorage.setItem(key, value);

  const setLanguageState = (lang: Language) => {
    setLanguage(lang);
    locallyStore(languageLocalKey, lang);
  };

  const setModeState = (mode: Mode) => {
    setMode(mode);
    locallyStore(modeLocalKey, mode);
  };

  const setAccentState = (accent: Accent) => {
    setAccent(accent);
    locallyStore(accentLocalKey, accent);
  };

  return (
    <Box width="96">
      <Box borderBottomWidth="0.375" paddingX="6" paddingY="4">
        <Text variant="large" color="textPrimary" weight="bold" align="center">
          Settings
        </Text>
      </Box>
      <Box padding="6">
        <Stack space="6">
          <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Language
              </Text>
              <Box>
                <select
                  name="language"
                  value={language}
                  className={styles.select}
                  onChange={(event) =>
                    setLanguageState(event.target.value as Language)
                  }
                >
                  {languages.map((languageValue, index) =>
                    <option value={languageValue} key={index}>{languageValue}</option>
                  )}
                </select>
              </Box>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Mode
              </Text>
              <Box>
                <select
                  name="mode"
                  value={mode}
                  className={styles.select}
                  onChange={(event) =>
                    setModeState(event.target.value as Mode)
                  }
                >
                  {modes.map((modeValue, index) =>
                    <option value={modeValue} key={index}>{modeValue}</option>
                  )}
                </select>
              </Box>
            </Stack>
            <Stack direction="horizontal" justify="space-between">
              <Text variant="small" color="textSecondary">
                Color Scheme
              </Text>
              <Box>
                <select
                  name="accent"
                  value={accent}
                  className={styles.select}
                  onChange={(event) =>
                    setAccentState(event.target.value as Accent)
                  }
                >
                  {accents.map((accentValue, index) =>
                    <option value={accentValue} key={index}>{accentValue}</option>
                  )}
                </select>
              </Box>
            </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default SettingsModal;
