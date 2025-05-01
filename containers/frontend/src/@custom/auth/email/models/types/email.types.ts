
/**
 * @enum EmailTokenAction
 * @description Enumération des actions de validation d'email supportées.
 */
export enum EmailTokenAction {
    VERIFY_EMAIL = 'verify-email',
    CONFIRM_EMAIL_CHANGE = 'confirm-email-change',
    CONFIRM_SECONDARY_EMAIL_CHANGE = 'confirm-secondary-email-change',
    CONFIRM_SECONDARY_EMAIL_DELETION = 'confirm-secondary-email-deletion',
}