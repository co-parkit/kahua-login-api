/**
 * Centralized validator for emails
 * Provides consistent validations throughout the application
 */
export class EmailValidator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * Validate if an email has the correct format
   */
  static isValid(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    return this.EMAIL_REGEX.test(email.trim());
  }

  /**
   * Validate if an email is valid and throw an exception if not
   */
  static validate(email: string): void {
    if (!this.isValid(email)) {
      throw new Error(`Invalid email format: ${email}`);
    }
  }

  /**
   * Normalize an email (trim and lowercase)
   */
  static normalize(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Validate multiple emails
   */
  static validateMultiple(emails: string[]): {
    valid: string[];
    invalid: string[];
  } {
    const valid: string[] = [];
    const invalid: string[] = [];

    emails.forEach((email) => {
      if (this.isValid(email)) {
        valid.push(this.normalize(email));
      } else {
        invalid.push(email);
      }
    });

    return { valid, invalid };
  }
}
