import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useEnsName } from 'wagmi';

import { i18n } from '~/core/languages';
import { Box, Inline, Stack, Symbol, Text } from '~/design-system';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/DropdownMenu/DropdownMenu';
import { ROUTES } from '../../urls';

export const MoreMenu = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const navigate = useNavigate();

  const openProfile = React.useCallback(() => {
    chrome.tabs.create({
      url: `https://rainbow.me/${ensName ?? address}`,
    });
  }, [address, ensName]);

  const onValueChange = React.useCallback(
    (value: 'settings' | 'profile') => {
      switch (value) {
        case 'settings':
          navigate(ROUTES.SETTINGS);
          break;
        case 'profile':
          openProfile();
          break;
      }
    },
    [navigate, openProfile],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Box position="relative" id="home-page-header-right">
          {children}
        </Box>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup
          onValueChange={(value) =>
            onValueChange(value as 'settings' | 'profile')
          }
        >
          <Stack space="4px">
            <Stack>
              <DropdownMenuRadioItem value="settings">
                <Box id="settings-link">
                  <Inline alignVertical="center" space="8px">
                    <Symbol
                      size={12}
                      symbol="gearshape.fill"
                      weight="semibold"
                    />
                    <Text size="14pt" weight="semibold">
                      {i18n.t('menu.home_header_right.settings')}
                    </Text>
                  </Inline>
                </Box>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="qr-code">
                <Inline alignVertical="center" space="8px">
                  <Symbol size={12} symbol="qrcode" weight="semibold" />
                  <Text size="14pt" weight="semibold">
                    {i18n.t('menu.home_header_right.qr_code')}
                  </Text>
                </Inline>
              </DropdownMenuRadioItem>
            </Stack>
            <Stack space="4px">
              <DropdownMenuSeparator />
              <DropdownMenuRadioItem value="profile">
                <Box width="full">
                  <Inline alignVertical="center" alignHorizontal="justify">
                    <Inline alignVertical="center" space="8px">
                      <Symbol
                        size={12}
                        symbol="person.crop.circle.fill"
                        weight="semibold"
                      />
                      <Text size="14pt" weight="semibold">
                        {i18n.t('menu.home_header_right.rainbow_profile')}
                      </Text>
                    </Inline>
                    <Symbol
                      size={12}
                      symbol="arrow.up.forward.circle"
                      weight="semibold"
                      color="labelTertiary"
                    />
                  </Inline>
                </Box>
              </DropdownMenuRadioItem>
            </Stack>
          </Stack>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
