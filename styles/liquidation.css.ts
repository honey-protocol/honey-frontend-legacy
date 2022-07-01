import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';
export const liquidationWrapper = style({
  color: 'white'
});
export const subWrapper = style({
  background: 'rgb(30, 30, 30)',
  margin: '.75em 0',
  padding: '1em',
  borderRadius: '1em',
  verticalAlign: 'center',
});
globalStyle(`${subWrapper} > div > div`, {
  alignSelf: 'center'
})
export const subContainer = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%'
});
globalStyle(`${subContainer} > div`, {
  flex: '1 1 0px',
  textAlign: 'center'
});
globalStyle(`${subContainer} button`, {
  margin: '0 auto'
});
export const imageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});
export const healthFactorHigh = style({
  width: '5em'
});
globalStyle(`${healthFactorHigh} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  color: 'rgb(48, 208, 88) !important',
  padding: '0.5em',
  background: 'rgb(26, 58, 34)',
  borderRadius: '10px',
  margin: '0 auto'
});
export const healthFactorMedium = style({
  width: '5em'
});
globalStyle(`${healthFactorMedium} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  padding: '0.5em',
  background: 'rgb(255, 215, 0, .3)',
  borderRadius: '10px',
  margin: '0 auto'
});
export const healthFactorLow = style({
  width: '5em'
});
globalStyle(`${healthFactorLow} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  color: 'red',
  padding: '0.5em',
  background: 'rgba(255, 0, 0, .3)',
  borderRadius: '10px',
  margin: '0 auto'
});
export const liquidationDetaiPageWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: '70%',
  width: '85%',
  padding: '1em 0',
  borderRadius: '1em'
});

globalStyle(`${liquidationDetaiPageWrapper} div`, {
  flex: '1 1 0px',
  marginRight: '.5em'
});

globalStyle(`${liquidationDetaiPageWrapper} > div:first-child`, {
  marginRight: '1.5em'
});

globalStyle(`${liquidationDetaiPageWrapper} button`, {
  width: '100%'
});

export const buttonWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between'
});
globalStyle(`${buttonWrapper} button`, {
  margin: '1em 0',
  width: '45%'
});
export const currentBidding = style({
  display: 'flex',
  flexDirection: 'row',
  marginTop: '1.5em'
}); 

export const currentBiddingFirstBlock = style({
  borderRight: '2px solid gray',
  marginRight: '2.5em'
});

export const biddingBlock = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: '1em 0'
});
globalStyle(`${biddingBlock}, input::-webkit-outer-spin-button, input::-webkit-inner-spin-button `, {
  WebkitAppearance: 'none',
  MozAppearance: 'textfield',
  margin: 0
}); 
export const currentBidInput = style({
  maxWidth: '10em',
  width: '100%',
  fontSize: '1.8em',
  color: 'gray',
  border: 'none',
  borderRadius: '5px',
  padding: '.25em',
  margin: '.5em .5em .5m 0'
});
export const biddingHistory = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: '1em 0 '
});
globalStyle(`${biddingHistory} img`, {
  margin: '0 1em 0 0',
  borderRadius: '32px'
});

globalStyle(`${biddingHistory} div`, {
  alignSelf: 'center'
});

export const avatarTitle = style({
  fontSize: '1.2em',
  fontWeight: '600'
});

export const attributeBlock = style({
  background: 'none',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginLeft: '-.5em'
});

globalStyle(`${attributeBlock} > div`, {
  background: 'rgb(238, 240, 243)',
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
  fontWeight: '300',
  fontSize: '.9em'
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
});

globalStyle(`${nftDetailBlock} > div:first-child`, {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  margin: '.5em 0',
  fontSize: '1.2em',
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