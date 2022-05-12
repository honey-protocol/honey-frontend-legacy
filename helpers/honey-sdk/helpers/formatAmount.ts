const reverseString = (toReverse: string): string => {
  return toReverse.split('').reverse().join('');
};

const formatAmount = (amount: number, size: number, insert: string): string => {
  const splitedNumber = amount.toString().split('.');
  const wholeNumber = splitedNumber[0];
  const decimal = splitedNumber[1] || 0;
  let formattedAmount: string = reverseString(wholeNumber.toString());
  const regex = new RegExp('.{1,' + size + '}', 'g');
  const matchResult: RegExpMatchArray | null = formattedAmount.match(regex);
  if (matchResult === null) {
    return '';
  }
  formattedAmount = matchResult.join(insert);

  if (decimal) {
    formattedAmount = `${decimal}.${matchResult.join(insert)}`;
  }
  return reverseString(formattedAmount);
};

export default formatAmount;
