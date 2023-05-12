/**
 *
 * @param lowerLimit Lower limit of the cardinality
 * @param upperLimit Upper limit of the cardinality
 * @returns an object with 'valid' and 'message' properties. The valid property indicates if the cardinality is valid or not, and the message property provides the reason for the invalid cardinality.
 */
export function areCardinalitiesValid(lowerLimit: string, upperLimit: string): {valid: boolean, message: string} {
  // If lower limit is *, we cannot/should not have an upper limit. e.g. [*] is valid, [*..2] and [*..*] are not.
  if (lowerLimit === "*" && upperLimit) {
      return { valid: false, message: "Lower limit '*' should not have an upper limit." };
      // If both limits are numbers, check if lower limit is greater or equal to upper limit.
  } else if (!isNaN(Number(lowerLimit)) && !isNaN(Number(upperLimit)) && Number(lowerLimit) >= Number(upperLimit)) {
      // If so, the cardinality is invalid. e.g. [2..1] and [2..2] are invalid.
      return { valid: false, message: "Lower limit should be strictly less than upper limit." };
  // All other cases should be valid.
  } else {
      return { valid: true, message: "" };
  }
}
