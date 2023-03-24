import React, { useCallback, useState } from 'react';

import { i18n } from '~/core/languages';
import { useGasStore } from '~/core/state';
import { ParsedSearchAsset } from '~/core/types/assets';
import { ChainId } from '~/core/types/chains';
import {
  Box,
  Button,
  ButtonSymbol,
  Inline,
  Row,
  Rows,
  Stack,
  Symbol,
  Text,
} from '~/design-system';
import { AccentColorProviderWrapper } from '~/design-system/components/Box/ColorContext';
import { ButtonOverflow } from '~/design-system/components/Button/ButtonOverflow';

import { ChevronDown } from '../../components/ChevronDown/ChevronDown';
import {
  ExplainerSheet,
  useExplainerSheetParams,
} from '../../components/ExplainerSheet/ExplainerSheet';
import { Navbar } from '../../components/Navbar/Navbar';
import { SwapFee } from '../../components/TransactionFee/TransactionFee';
import {
  useSwapActions,
  useSwapAssets,
  useSwapDropdownDimensions,
  useSwapInputs,
  useSwapQuote,
  useSwapQuoteHandler,
  useSwapSettings,
  useSwapValidations,
} from '../../hooks/swap';

import { SwapReviewSheet } from './SwapReviewSheet/SwapReviewSheet';
import { SwapSettings } from './SwapSettings/SwapSettings';
import { TokenToBuyInput } from './SwapTokenInput/TokenToBuyInput';
import { TokenToSellInput } from './SwapTokenInput/TokenToSellInput';

export function Swap() {
  const [showSwapSettings, setShowSwapSettings] = useState(false);
  const [showSwapReview, setShowSwapReview] = useState(false);

  const { explainerSheetParams, showExplainerSheet, hideExplainerSheet } =
    useExplainerSheetParams();
  const { selectedGas } = useGasStore();

  const {
    assetsToSell,
    assetToSellFilter,
    assetsToBuy,
    assetToBuyFilter,
    sortMethod,
    assetToBuy,
    assetToSell,
    outputChainId,
    setSortMethod,
    setOutputChainId,
    setAssetToSell,
    setAssetToBuy,
    setAssetToSellFilter,
    setAssetToBuyFilter,
  } = useSwapAssets();

  const { toSellInputHeight, toBuyInputHeight } = useSwapDropdownDimensions({
    assetToSell,
    assetToBuy,
  });

  const { source, slippage, setSettings, flashbotsEnabled } = useSwapSettings({
    chainId: assetToSell?.chainId || ChainId.mainnet,
  });

  const {
    assetToSellInputRef,
    assetToBuyInputRef,
    assetToSellMaxValue,
    assetToBuyValue,
    assetToSellValue,
    assetToSellDropdownClosed,
    assetToBuyDropdownClosed,
    independentField,
    flipAssets,
    onAssetToSellInputOpen,
    onAssetToBuyInputOpen,
    setAssetToSellMaxValue,
    setAssetToSellValue,
    setAssetToSellInputValue,
    setAssetToBuyValue,
    setAssetToBuyInputValue,
  } = useSwapInputs({
    assetToSell,
    assetToBuy,
    selectedGas,
    setAssetToSell,
    setAssetToBuy,
  });

  const { data: quote, isLoading } = useSwapQuote({
    assetToSell,
    assetToBuy,
    assetToSellValue,
    assetToBuyValue,
    independentField,
    source,
    slippage,
  });

  const { buttonLabel: validationButtonLabel, enoughAssetsForSwap } =
    useSwapValidations({
      assetToSell,
      assetToSellValue,
      selectedGas,
    });

  const {
    buttonLabel,
    buttonLabelColor,
    buttonDisabled,
    buttonIcon,
    buttonColor,
    timeEstimate,
    buttonAction,
  } = useSwapActions({
    quote,
    isLoading,
    assetToSell,
    assetToBuy,
    enoughAssetsForSwap,
    validationButtonLabel,
    showExplainerSheet,
    hideExplainerSheet,
    setShowSwapReview,
  });

  useSwapQuoteHandler({
    assetToBuy,
    assetToSell,
    quote,
    independentField,
    setAssetToBuyValue,
    setAssetToSellValue,
  });

  const openSettings = useCallback(() => {
    setShowSwapSettings(true);
    onAssetToSellInputOpen(false);
    onAssetToBuyInputOpen(false);
  }, [onAssetToBuyInputOpen, onAssetToSellInputOpen]);

  const selectAssetToSell = useCallback(
    (asset: ParsedSearchAsset | null) => {
      setAssetToSell(asset);
      setAssetToSellInputValue('');
      setAssetToBuyInputValue('');
    },
    [setAssetToBuyInputValue, setAssetToSell, setAssetToSellInputValue],
  );

  const hideSwapReview = useCallback(() => setShowSwapReview(false), []);

  return (
    <>
      <Navbar
        title={i18n.t('swap.title')}
        background={'surfaceSecondary'}
        leftComponent={<Navbar.CloseButton />}
        rightComponent={
          <ButtonSymbol
            color="surfaceSecondaryElevated"
            height={'32px'}
            onClick={openSettings}
            symbol="switch.2"
            symbolColor="labelSecondary"
            variant="flat"
            testId="swap-settings-navbar-button"
          />
        }
      />
      <SwapReviewSheet
        show={showSwapReview}
        assetToBuy={assetToBuy}
        assetToSell={assetToSell}
        quote={quote}
        flashbotsEnabled={flashbotsEnabled}
        hideSwapReview={hideSwapReview}
      />
      <ExplainerSheet
        show={explainerSheetParams.show}
        header={explainerSheetParams.header}
        title={explainerSheetParams.title}
        description={explainerSheetParams.description}
        actionButton={explainerSheetParams.actionButton}
        linkButton={explainerSheetParams.linkButton}
        testId={explainerSheetParams.testId}
      />
      <SwapSettings
        show={showSwapSettings}
        onDone={() => setShowSwapSettings(false)}
        accentColor={
          assetToBuy?.colors?.primary || assetToBuy?.colors?.fallback
        }
        setSettings={setSettings}
        slippage={slippage}
        chainId={assetToSell?.chainId}
      />
      <Box
        background="surfaceSecondary"
        style={{ height: 535 }}
        paddingBottom="20px"
        paddingHorizontal="12px"
      >
        <Rows alignVertical="justify">
          <Row height="content">
            <Stack space="8px">
              <AccentColorProviderWrapper
                color={
                  assetToSell?.colors?.primary || assetToSell?.colors?.fallback
                }
              >
                <TokenToSellInput
                  dropdownHeight={toSellInputHeight}
                  asset={assetToSell}
                  assets={assetsToSell}
                  selectAsset={selectAssetToSell}
                  onDropdownOpen={onAssetToSellInputOpen}
                  dropdownClosed={assetToSellDropdownClosed}
                  setSortMethod={setSortMethod}
                  assetFilter={assetToSellFilter}
                  setAssetFilter={setAssetToSellFilter}
                  sortMethod={sortMethod}
                  zIndex={2}
                  placeholder={i18n.t('swap.input_token_to_swap_placeholder')}
                  assetToSellMaxValue={assetToSellMaxValue}
                  setAssetToSellMaxValue={setAssetToSellMaxValue}
                  assetToSellValue={assetToSellValue}
                  setAssetToSellInputValue={setAssetToSellInputValue}
                  inputRef={assetToSellInputRef}
                />
              </AccentColorProviderWrapper>

              <Box
                marginVertical="-20px"
                style={{ zIndex: assetToSellDropdownClosed ? 3 : 1 }}
              >
                <Inline alignHorizontal="center">
                  <ButtonOverflow testId="swap-flip-button">
                    <Box
                      boxShadow="12px surfaceSecondaryElevated"
                      background="surfaceSecondaryElevated"
                      borderRadius="32px"
                      borderWidth={'1px'}
                      borderColor="buttonStroke"
                      style={{ width: 42, height: 32, zIndex: 10 }}
                      onClick={flipAssets}
                    >
                      <Box width="full" height="full" alignItems="center">
                        <Inline
                          height="full"
                          alignHorizontal="center"
                          alignVertical="center"
                        >
                          <Stack alignHorizontal="center">
                            <Box marginBottom="-4px">
                              <ChevronDown color="labelTertiary" />
                            </Box>
                            <Box marginTop="-4px">
                              <ChevronDown color="labelQuaternary" />
                            </Box>
                          </Stack>
                        </Inline>
                      </Box>
                    </Box>
                  </ButtonOverflow>
                </Inline>
              </Box>

              <AccentColorProviderWrapper
                color={
                  assetToBuy?.colors?.primary || assetToBuy?.colors?.fallback
                }
              >
                <TokenToBuyInput
                  dropdownHeight={toBuyInputHeight}
                  asset={assetToBuy}
                  assets={assetsToBuy}
                  selectAsset={setAssetToBuy}
                  onDropdownOpen={onAssetToBuyInputOpen}
                  dropdownClosed={assetToBuyDropdownClosed}
                  zIndex={1}
                  placeholder={i18n.t(
                    'swap.input_token_to_receive_placeholder',
                  )}
                  setOutputChainId={setOutputChainId}
                  outputChainId={outputChainId}
                  assetFilter={assetToBuyFilter}
                  setAssetFilter={setAssetToBuyFilter}
                  assetToBuyValue={assetToBuyValue}
                  setAssetToBuyInputValue={setAssetToBuyInputValue}
                  inputRef={assetToBuyInputRef}
                />
              </AccentColorProviderWrapper>

              {timeEstimate?.isLongWait ? (
                <ButtonOverflow>
                  <Box paddingHorizontal="20px">
                    <Box
                      paddingVertical="10px"
                      paddingHorizontal="12px"
                      borderRadius="round"
                      borderWidth="1px"
                      borderColor="buttonStroke"
                      background="surfacePrimaryElevatedSecondary"
                    >
                      <Inline
                        space="8px"
                        alignVertical="center"
                        alignHorizontal="center"
                      >
                        <Inline space="4px" alignVertical="center">
                          <Symbol
                            symbol="exclamationmark.triangle.fill"
                            size={16}
                            color="orange"
                            weight="bold"
                          />
                          <Text color="label" size="14pt" weight="bold">
                            {i18n.t('swap.long_wait.title')}
                          </Text>
                        </Inline>
                        <Box
                          background="fillSecondary"
                          style={{ width: '14px', height: '2px' }}
                        />

                        <Text color="orange" size="14pt" weight="semibold">
                          {i18n.t('swap.long_wait.description', {
                            time: timeEstimate?.timeEstimateDisplay,
                          })}
                        </Text>
                      </Inline>
                    </Box>
                  </Box>
                </ButtonOverflow>
              ) : null}
            </Stack>
          </Row>
          <Row height="content">
            {!!assetToBuy && !!assetToSell ? (
              <AccentColorProviderWrapper
                color={
                  assetToBuy?.colors?.primary || assetToBuy?.colors?.fallback
                }
              >
                <Box paddingHorizontal="8px">
                  <Rows space="20px">
                    <Row>
                      <SwapFee
                        chainId={assetToSell?.chainId || ChainId.mainnet}
                        quote={quote}
                        accentColor={
                          assetToBuy?.colors?.primary ||
                          assetToBuy?.colors?.fallback
                        }
                        assetToSell={assetToSell}
                        assetToBuy={assetToBuy}
                      />
                    </Row>
                    <Row>
                      <Button
                        onClick={buttonAction}
                        height="44px"
                        variant="flat"
                        color={buttonColor}
                        width="full"
                        testId="swap-review-button"
                        disabled={buttonDisabled}
                      >
                        <Inline space="8px" alignVertical="center">
                          {buttonIcon}
                          <Text
                            testId="swap-confirmation-button"
                            color={buttonLabelColor}
                            size="16pt"
                            weight="bold"
                          >
                            {buttonLabel}
                          </Text>
                        </Inline>
                      </Button>
                    </Row>
                  </Rows>
                </Box>
              </AccentColorProviderWrapper>
            ) : (
              <Box paddingHorizontal="8px">
                <Button
                  height="44px"
                  variant="flat"
                  color="surfaceSecondary"
                  width="full"
                  disabled
                >
                  <Text color="labelQuaternary" size="14pt" weight="bold">
                    {i18n.t('swap.select_tokens_to_swap')}
                  </Text>
                </Button>
              </Box>
            )}
          </Row>
        </Rows>
      </Box>
    </>
  );
}
