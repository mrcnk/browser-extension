import React, { useMemo } from 'react';

import { i18n } from '~/core/languages';
import { ParsedAddressAsset } from '~/core/types/assets';
import { handleSignificantDecimals } from '~/core/utils/numbers';
import { Box, Inline, Text, TextOverflow } from '~/design-system';

const { innerWidth: windowWidth } = window;
const HALF_WINDOW_WIDTH = windowWidth / 2;
const TEXT_MAX_WIDTH = HALF_WINDOW_WIDTH - 90;

export const TokenToReceiveInfo = ({
  asset,
}: {
  asset: ParsedAddressAsset | null;
}) => {
  const priceChangeDisplay = useMemo(() => {
    const priceChange = asset?.native?.price?.change;
    return priceChange?.length ? priceChange : '-';
  }, [asset?.native?.price?.change]);

  if (!asset) return null;
  return (
    <Box width="full">
      <Inline alignHorizontal="justify">
        <Inline alignVertical="center" space="4px">
          <TextOverflow
            maxWidth={TEXT_MAX_WIDTH}
            as="p"
            size="12pt"
            weight="semibold"
            color="labelTertiary"
          >
            {asset?.native?.price?.display}
          </TextOverflow>
          <Text as="p" size="12pt" weight="medium" color="labelQuaternary">
            ({priceChangeDisplay})
          </Text>
        </Inline>

        <Inline alignVertical="center" space="4px">
          <Text size="12pt" weight="medium" color="labelQuaternary">
            {`${i18n.t('swap.balance')}:`}
          </Text>
          <TextOverflow
            maxWidth={TEXT_MAX_WIDTH}
            size="12pt"
            weight="medium"
            color="labelSecondary"
          >
            {handleSignificantDecimals(asset?.balance?.amount, asset?.decimals)}
          </TextOverflow>
        </Inline>
      </Inline>
    </Box>
  );
};
