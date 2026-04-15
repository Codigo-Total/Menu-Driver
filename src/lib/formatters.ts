/**
 * Formats a number to Argentine Pesos (ARS), rounding to the nearest integer
 * and using period (.) as thousand separator.
 *
 * @example formatPriceARS(1500) // "1.500"
 * @example formatPriceARS(25000.75) // "25.001"
 */
export const formatPriceARS = (price: number): string => {
  return Math.round(price).toLocaleString("es-AR");
};
