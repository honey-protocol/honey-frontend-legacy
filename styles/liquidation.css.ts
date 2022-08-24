import { style, globalStyle } from '@vanilla-extract/css';
import { sprinkles, vars } from './theme.css';
/**
 * set initial styles for the main liq. wrapper
*/
export const liquidationWrapper = style({
  width: '100%',
  padding: '0'
});
/**
 * set base color to white
*/
globalStyle(`${liquidationWrapper} > *`, {
  color: 'white'
});
/**
 * base card layout liq. market overview
*/
export const subWrapper = style({
  background: 'rgb(30, 30, 30)',
  margin: '.75em 0',
  padding: '.75em 0',
  borderRadius: '1em',
  verticalAlign: 'center',
  position: 'relative'
});

globalStyle(`${subWrapper} > div > div`, {
  alignSelf: 'center'
});

globalStyle(`${subWrapper} svg`, {
  position: 'absolute',
  right: '-.25em',
  top: '-.25em'
});



export const subContainer = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  width: '100%'
});

globalStyle(`${subContainer} > div`, {
  flex: '1 1 0px',
  textAlign: 'center'
});

globalStyle(`${subContainer} button`, {
  margin: '0 auto'
});

globalStyle(`${subContainer} div:nth-child(n+2)`, {
  display: 'none',
  '@media': {
    'screen and (min-width: 720px)': {
      display: 'flex',
      justifyContent: 'center'
    }
  }
});

globalStyle(`${subContainer} div:last-child`, {
  display: 'flex',
  justifyContent: 'space-between',
});

export const collectionCard = style({
  display: 'flex',
  height: '8em',
  flexDirection: 'column',
  flexWrap: 'wrap',
  minWidth: '10em',
  marginLeft: '-1em',
  '@media': {
    'screen and (min-width: 720px)': {
      marginLeft: 0,
      flexWrap: 'nowrap',
      height: 'auto',
      flexDirection: 'row',
    }
  }
});

globalStyle(`${subContainer} div:nth-child(1)`, {
  '@media': {
    'screen and (min-width: 720px)': {
      order: '1'
    }
  }
});

globalStyle(`${subContainer} div:nth-child(2)`, {
  '@media': {
    'screen and (min-width: 720px)': {
      order: '2'
    }
  }
});

globalStyle(`${subContainer} div:nth-child(3)`, {
  '@media': {
    'screen and (min-width: 720px)': {
      order: '5'
    }
  }
});

globalStyle(`${subContainer} div:nth-child(4)`, {
  '@media': {
    'screen and (min-width: 720px)': {
      order: '4'
    }
  }
});

globalStyle(`${subContainer} div:nth-child(5)`, {
  '@media': {
    'screen and (min-width: 720px)': {
      order: '6'
    }
  }
});

globalStyle(`${subContainer} div:nth-child(6)`, {
  '@media': {
    'screen and (min-width: 720px)': {
      order: '3'
    }
  }
});

globalStyle(`${collectionCard} div:nth-child(n+2)`, {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
});

globalStyle(`${collectionCard} div:first-child`, {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
});

globalStyle(`${collectionCard} > div`, {
  width: '50%',
  height: '2em',
  margin: '.25em',
  justifyContent: 'center',
  display: 'flex',
  '@media': {
    'screen and (min-width: 720px)': {
      width: '20%'
    }
  }
});

export const collectionCardWrapper = style({
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  verticalAlign: 'center',
  minWidth: '25%',
  '@media': {
    'screen and (min-width: 720px)': {
    }
  }
});

globalStyle(`${collectionCardWrapper} > div:first-child`, {
  '@media': {
    'screen and (min-width: 720px)': {
      display: 'none'
    }
  }
});

export const imageWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const healthFactorHigh = style({
  background: 'rgb(26, 58, 34)',
  color: 'rgb(48, 208, 88)',
  fontWeight: '600',
  padding: '.5em 1em',
  borderRadius: '10px',
  width: '7em!important',
  margin: '0 auto',
  marginLeft: '.5em!important',
  '@media': {
    'screen and (min-width: 350px)': {
      marginLeft: 0,
      margin: '0 auto!important',
      alignSelf: 'center'
    }
  }
});

globalStyle(`${healthFactorHigh} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  padding: '0.5em',
  background: 'rgb(255, 215, 0, .3)',
  borderRadius: '10px',
  margin: '0 auto'
});

export const healthFactorMedium = style({
  background: 'rgba(58, 45, 25, 100)',
  color: 'rgb(243, 163, 60)',
  fontWeight: '600',
  padding: '.5em 1em',
  borderRadius: '10px',
  width: '7em!important',
  margin: '0 auto',
  marginLeft: '.5em!important',
  '@media': {
    'screen and (min-width: 350px)': {
      marginLeft: 0,
      margin: '0 auto!important',
      alignSelf: 'center'
    }
  }
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
  background: 'darkred',
  color: 'red',
  fontWeight: '600',
  padding: '.5em 1em',
  borderRadius: '10px',
  width: '7em!important',
  margin: '0 auto',
  marginLeft: '.5em!important',
  '@media': {
    'screen and (min-width: 350px)': {
      marginLeft: 0,
      margin: '0 auto!important',
      alignSelf: 'center'
    }
  }
});

globalStyle(`${healthFactorLow} div`, {
  width: '75%',
  textAlign: 'center',
  fontWeight: '600',
  padding: '0.5em',
  background: 'rgb(255, 215, 0, .3)',
  borderRadius: '10px',
  margin: '0 auto'
});

export const liquidationDetaiPageWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  width: '70%',
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
});

export const poolBlock = style({
  display: 'flex',
  alignItems: 'center',
});

globalStyle(`${poolBlock} > img`, {
  width: '4em',
  borderRadius: '2em',
  marginRight: '1em'
});

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
  width: '100%'
});

export const biddingOverview = style({
  margin: '0',
  marginTop: '-2em'
});

globalStyle(`${biddingOverview} > h4`, {
  color: 'rgb(179,179,179)',
  fontWeight: '500',
});

globalStyle(`${biddingOverview} a`, {
  color: 'orange',
  textDecoration: 'underline'
});

export const healthFactor = style({
  background: 'rgb(26, 58, 34)',
  color: 'rgb(48, 208, 88)',
  fontWeight: '600',
  padding: '.5em 1em',
  borderRadius: '10px',
  width: '7em!important',
  margin: '0 auto',
  marginLeft: '.5em!important',
  '@media': {
    'screen and (min-width: 350px)': {
      marginLeft: 0,
      margin: '0 auto!important',
      alignSelf: 'center'
    }
  }
});

export const highLightPosition = style({
  borderLeft: '5px solid orange',
  borderRadius: '20px'
});

export const highLightNoPosition = style({
  borderLeft: 'none'
});

export const headWrapper = style({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center'
});

export const headWrapperSub = style({
  borderRadius: '8px',
  padding: '.5em',
  flexDirection: 'row',
  alignItems: 'center',
  color: 'orange',
  display: 'flex',
  justifyContent: 'flex-end'
});

export const collectionLiqWrapper = style({
  display: 'flex',
  justifyContent: 'space-between'
})

export const currentBidWrapper = style({

});

globalStyle(`${currentBidWrapper} > div`, {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  verticalAlign: 'center',
});