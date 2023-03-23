import { motion } from 'framer-motion';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Address } from 'wagmi';

import { i18n } from '~/core/languages';
import { ETH_ADDRESS } from '~/core/references';
import { ParsedAddressAsset } from '~/core/types/assets';
import { handleSignificantDecimals } from '~/core/utils/numbers';
import { Bleed, Box, Inline, Stack, Symbol, Text } from '~/design-system';
import { Input } from '~/design-system/components/Input/Input';
import { TextOverflow } from '~/design-system/components/TextOverflow/TextOverflow';

import { CoinIcon } from '../../components/CoinIcon/CoinIcon';
import {
  DropdownInputWrapper,
  dropdownContainerVariant,
  dropdownItemVariant,
} from '../../components/DropdownInputWrapper/DropdownInputWrapper';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../../components/DropdownMenu/DropdownMenu';
import { SortMethod } from '../../hooks/send/useSendAsset';
import { AssetRow } from '../home/Tokens';

import { InputActionButon } from './InputActionButton';

const { innerWidth: windowWidth } = window;

const TokenSortMenu = ({
  asset,
  setSortDropdownOpen,
  sortDropdownOpen,
  sortMethod,
  setSortMethod,
}: {
  asset: ParsedAddressAsset | null;
  setSortDropdownOpen: Dispatch<SetStateAction<boolean>>;
  sortDropdownOpen: boolean;
  sortMethod: string;
  setSortMethod: (method: SortMethod) => void;
}) => {
  return (
    <DropdownMenu onOpenChange={setSortDropdownOpen} open={sortDropdownOpen}>
      <DropdownMenuTrigger
        accentColor={asset?.colors?.primary || asset?.colors?.fallback}
        asChild
      >
        <Box>
          <Inline space="4px" alignVertical="center">
            <Symbol
              symbol="arrow.up.arrow.down"
              color="labelTertiary"
              weight="semibold"
              size={14}
            />
            <Text size="14pt" weight="semibold" color="labelTertiary">
              {i18n.t('send.tokens_input.sort')}
            </Text>
          </Inline>
        </Box>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        accentColor={asset?.colors?.primary || asset?.colors?.fallback}
        marginRight="32px"
      >
        <DropdownMenuRadioGroup
          value={sortMethod}
          onValueChange={(method) => {
            setSortMethod(method as SortMethod);
          }}
        >
          <DropdownMenuRadioItem value="token" selectedValue={sortMethod}>
            <Inline space="8px" alignVertical="center">
              <Bleed vertical="4px">
                <Symbol
                  weight="semibold"
                  symbol="record.circle.fill"
                  size={18}
                  color="label"
                />
              </Bleed>

              <Text size="14pt" weight="semibold" color="label">
                {i18n.t('send.tokens_input.token_balance')}
              </Text>
            </Inline>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="chain" selectedValue={sortMethod}>
            <Inline space="8px" alignVertical="center">
              <Bleed vertical="4px">
                <Symbol
                  weight="semibold"
                  symbol="network"
                  size={18}
                  color="label"
                />
              </Bleed>

              <Text size="14pt" weight="semibold" color="label">
                {i18n.t('send.tokens_input.networks')}
              </Text>
            </Inline>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SendTokenInput = ({
  asset,
  assets,
  selectAssetAddress,
  dropdownClosed = false,
  setSortMethod,
  sortMethod,
  zIndex,
}: {
  asset: ParsedAddressAsset | null;
  assets: ParsedAddressAsset[];
  selectAssetAddress: (address: Address | typeof ETH_ADDRESS | '') => void;
  dropdownClosed: boolean;
  setSortMethod: (sortMethod: SortMethod) => void;
  sortMethod: SortMethod;
  zIndex?: number;
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const onDropdownAction = useCallback(() => {
    setDropdownVisible(!dropdownVisible);
    dropdownVisible ? inputRef?.current?.blur() : inputRef?.current?.focus();
  }, [dropdownVisible]);

  const onSelectAsset = useCallback(
    (address: Address | typeof ETH_ADDRESS | '') => {
      selectAssetAddress(address);
      setDropdownVisible(false);
    },
    [selectAssetAddress],
  );

  const onInputValueChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    [setInputValue],
  );

  const filteredAssets = useMemo(() => {
    return inputValue
      ? assets.filter(
          ({ name, symbol, address }) =>
            name.toLowerCase().startsWith(inputValue.toLowerCase()) ||
            symbol.toLowerCase().startsWith(inputValue.toLowerCase()) ||
            address.toLowerCase().startsWith(inputValue.toLowerCase()),
        )
      : assets;
  }, [assets, inputValue]);

  const onCloseDropdown = useCallback(() => {
    onSelectAsset('');
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 200);
  }, [onSelectAsset]);

  const selectAsset = useCallback(
    (address: Address | typeof ETH_ADDRESS | '') => {
      onSelectAsset(address);
      setInputValue('');
    },
    [onSelectAsset],
  );

  useEffect(() => {
    if (dropdownClosed) {
      setDropdownVisible(false);
    }
  }, [dropdownClosed]);

  const inputVisible = useMemo(() => !asset, [asset]);

  return (
    <DropdownInputWrapper
      zIndex={zIndex || 1}
      dropdownHeight={376}
      testId={'token-input'}
      leftComponent={
        <Box>
          <CoinIcon asset={asset ?? undefined} />
        </Box>
      }
      centerComponent={
        <Box width="full">
          {inputVisible ? (
            <Box as={motion.div} layout="position">
              <Input
                testId="token-input"
                value={inputValue}
                placeholder={'Token'}
                onChange={onInputValueChange}
                height="32px"
                variant="transparent"
                style={{ paddingLeft: 0, paddingRight: 0 }}
                innerRef={inputRef}
              />
            </Box>
          ) : (
            <Stack space="8px">
              <TextOverflow
                maxWidth={windowWidth / 2}
                size="16pt"
                weight="semibold"
                color={`${asset ? 'label' : 'labelTertiary'}`}
              >
                {asset?.name ?? i18n.t('send.input_token_placeholder')}
              </TextOverflow>

              {asset && (
                <Text
                  as="p"
                  size="12pt"
                  weight="semibold"
                  color="labelTertiary"
                >
                  {handleSignificantDecimals(
                    asset?.balance.amount,
                    asset?.decimals,
                  )}{' '}
                  {i18n.t('send.tokens_input.available')}
                </Text>
              )}
            </Stack>
          )}
        </Box>
      }
      rightComponent={
        <InputActionButon
          showClose={!!asset}
          onClose={onCloseDropdown}
          dropdownVisible={dropdownVisible}
          testId={`input-wrapper-close-${'token-input'}`}
        />
      }
      dropdownComponent={
        <Stack space="8px">
          <Box paddingHorizontal="20px">
            <Inline alignHorizontal="justify">
              <Inline space="4px" alignVertical="center">
                <Symbol
                  symbol="record.circle.fill"
                  color="labelTertiary"
                  weight="semibold"
                  size={14}
                />
                <Text size="14pt" weight="semibold" color="labelTertiary">
                  {i18n.t('send.tokens_input.tokens')}
                </Text>
              </Inline>
              <TokenSortMenu
                asset={asset}
                setSortDropdownOpen={setSortDropdownOpen}
                sortDropdownOpen={sortDropdownOpen}
                sortMethod={sortMethod}
                setSortMethod={setSortMethod}
              />
            </Inline>
          </Box>
          <Box
            as={motion.div}
            variants={dropdownContainerVariant}
            initial="hidden"
            animate="show"
          >
            {!!filteredAssets?.length &&
              filteredAssets?.map((asset, i) => (
                <Box
                  paddingHorizontal="8px"
                  key={`${asset?.uniqueId}-${i}`}
                  onClick={() => selectAsset(asset.address)}
                  testId={`token-input-asset-${asset?.uniqueId}`}
                >
                  <Box
                    as={motion.div}
                    variants={dropdownItemVariant}
                    marginHorizontal="-8px"
                  >
                    <AssetRow uniqueId={asset?.uniqueId} />
                  </Box>
                </Box>
              ))}
            {!filteredAssets.length && (
              <Box alignItems="center" style={{ paddingTop: 119 }}>
                <Box paddingHorizontal="44px">
                  <Stack space="16px">
                    <Text
                      color="label"
                      size="26pt"
                      weight="bold"
                      align="center"
                    >
                      {'👻'}
                    </Text>

                    <Text
                      color="labelTertiary"
                      size="20pt"
                      weight="semibold"
                      align="center"
                    >
                      {i18n.t('send.tokens_input.nothing_found')}
                    </Text>
                  </Stack>
                </Box>
              </Box>
            )}
          </Box>
        </Stack>
      }
      dropdownVisible={dropdownVisible}
      onDropdownAction={onDropdownAction}
      borderVisible={!asset}
    />
  );
};
