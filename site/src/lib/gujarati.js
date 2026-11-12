const GU_DIGITS = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];

/** Replace ASCII digits with Gujarati digits; everything else is kept. */
export function toGujaratiDigits(value) {
  return String(value).replace(/[0-9]/g, (d) => GU_DIGITS[d]);
}
