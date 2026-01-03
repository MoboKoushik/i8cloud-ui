/**
 * Data Masking Utilities
 *
 * Functions for masking sensitive data in UI
 */

/**
 * Mask email address (show first 3 chars + domain)
 */
export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;

  const [local, domain] = email.split('@');
  if (local.length <= 3) {
    return `${local}***@${domain}`;
  }

  return `${local.substring(0, 3)}***@${domain}`;
};

/**
 * Mask phone number (show last 4 digits)
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 4) return '****';

  const lastFour = phone.slice(-4);
  return `***-***-${lastFour}`;
};

/**
 * Mask credit card number (show last 4 digits)
 */
export const maskCardNumber = (cardNumber: string): string => {
  if (!cardNumber || cardNumber.length < 4) return '****';

  const lastFour = cardNumber.slice(-4);
  return `**** **** **** ${lastFour}`;
};

/**
 * Mask SSN (show last 4 digits)
 */
export const maskSSN = (ssn: string): string => {
  if (!ssn || ssn.length < 4) return '***-**-****';

  const lastFour = ssn.slice(-4);
  return `***-**-${lastFour}`;
};

/**
 * Mask username (show first 3 and last 2 characters)
 */
export const maskUsername = (username: string): string => {
  if (!username) return '';
  if (username.length <= 5) return `${username[0]}***`;

  const first = username.substring(0, 3);
  const last = username.substring(username.length - 2);
  return `${first}***${last}`;
};

/**
 * Mask API key/token (show first 8 and last 4 characters)
 */
export const maskToken = (token: string): string => {
  if (!token) return '';
  if (token.length <= 12) return '************';

  const first = token.substring(0, 8);
  const last = token.substring(token.length - 4);
  return `${first}...${last}`;
};

/**
 * Generic masking function (show first N and last M characters)
 */
export const maskString = (
  str: string,
  showFirst: number = 3,
  showLast: number = 2,
  maskChar: string = '*'
): string => {
  if (!str) return '';
  if (str.length <= showFirst + showLast) {
    return maskChar.repeat(str.length);
  }

  const first = str.substring(0, showFirst);
  const last = str.substring(str.length - showLast);
  const maskLength = str.length - showFirst - showLast;

  return `${first}${maskChar.repeat(maskLength)}${last}`;
};
