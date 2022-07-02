import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';

/*
  Latest iteration styles v.8
  Base styling for the page
*/
export const mainLiquidationHeading = style({
});
export const subLiquidationHeading = style({});

// flex layout for the page - set default styles
export const liquidationDetaiPageWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  color: 'rgb(255,255,255, .35)',
});

export const liquidationDetailPageFirstBlock = style({
  marginRight: '2em',
  fontSize: '1em'
});

globalStyle(`${liquidationDetailPageFirstBlock} button`, {
  width: '100%',
  margin: '0 auto'
});

// Pricing of NFT styles
export const nftPriceWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  margin: '1em 0'
});

globalStyle(`${nftPriceWrapper} > div:first-child`, {
  display: 'flex',
  flexDirection: 'row',

});

globalStyle(`${nftPriceWrapper} > div`, {

});

export const nftPriceWrapperDetail = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: '.5em'
});

export const liquidationDetailPageSecondBlock = style({

});

export const subHeading = style({
  fontSize: '1.2em',
  fontWeight: '600',
});

globalStyle(`${subHeading} > div`, {
  display: 'flex',
  margin: '.5em 0'
})

export const poolBlock = style({
  display: 'flex',
  alignItems: 'center',
});

globalStyle(`${poolBlock} > img`, {
  width: '4em',
  borderRadius: '2em',
  marginRight: '1em'
})

globalStyle(`${poolBlock} > div`, {
  fontWeight: '300'
});

export const flexBlock = style({
  display: 'flex',
  alignItems: 'center'
});

globalStyle(`${flexBlock} > svg`, {
  marginRight: '1em'
})

export const nftDetailBlock = style({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '1.2em',
});

globalStyle(`${nftDetailBlock} > div:first-child`, {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  margin: '.5em 0',
  fontSize: '1.2em',
  fontWeight: '600',
});

globalStyle(`${nftDetailBlock} > div`, {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
});

export const nftDetailBlockPrice = style({
  display: 'flex',
  flexDirection: 'row',
  margin: '1em 0'
});


globalStyle(`${nftDetailBlockPrice} > div:last-child`, {
  textAlign: 'end'
});

globalStyle(`${nftDetailBlock} button`, {
  width: '100%',
});

export const detailListWrapper = style({
  display: 'flex', 
  flexDirection: 'column',
  width: 'fit-content'
})
export const detailList = style({
  fontSize: '1.2em',
  fontWeight: '600',
  display: 'flex',
  justifyContent: 'flex-start',
});

globalStyle(`${detailListWrapper} > div:hover`, {
  cursor: 'pointer'
});

globalStyle(`${detailListWrapper} ul`, {
  padding: '0'
});

globalStyle(`${detailListWrapper} li`, {
  listStyleType: 'none'
});

globalStyle(`${detailList} > div`, {
  maxWidth: 'fit-content'
});

export const attributeBlock = style({
  background: 'none',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginLeft: '-.5em'
});

globalStyle(`${attributeBlock} > div`, {
  background: 'rgb(64, 49, 28)',
  borderRadius: '12px',
  fontSize: '1em',
  fontWeight: '600',
  margin: '.25em',
  padding: '.5em 1em',
  minWidth: '10em',
  maxWidth: '10em'
});

globalStyle(`${attributeBlock} > div > div:first-child`, {
  fontWeight: '300',
});

// styles for bid modal
export const inputButtonWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
});

globalStyle(`${inputButtonWrapper}, input::-webkit-outer-spin-button, input::-webkit-inner-spin-button `, {
  WebkitAppearance: 'none',
  MozAppearance: 'textfield',
  margin: 0
}); 

globalStyle(`${inputButtonWrapper}, span`, {
  color: 'white',
  display: 'block',
  textAlign: 'start'
}); 

globalStyle(`${inputButtonWrapper}, span:hover`, {
  cursor: 'pointer'
}); 

export const biddingModalInput = style({
  width: '100%',
  padding: '.5em',
  fontSize: '1.2em',
  margin: '0 0 .5em 0',
  borderRadius: '10px',
  border: 'none',
  transition: 'all 1s ease',
  WebkitTransition: 'all 1s ease',
  MozTransition: 'all 1s ease',
  msTransition: 'all 1s ease'
});

export const dubbleButtonWrapper = style({
  width: '100%'
});

globalStyle(`${dubbleButtonWrapper} button:first-child`, {
  margin: '.5em 0'
});