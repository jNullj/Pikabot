/**
 * Module for managing the last time birthdays were checked for all users in the guild.
 *
 * @module birthdayCheck
 */

/** @type {Date} */
let lastBirthdayChecked = new Date('2000-00-00');

/**
 * Set the date of the last time birthdays were checked.
 *
 * @function
 * @param {Date} date - The date of the last time birthdays were checked.
 * @returns {void}
 */
export function setLastBirthdayChecked(date) {
  lastBirthdayChecked = date;
}

/**
 * Get the date of the last time birthdays were checked.
 *
 * @function
 * @returns {Date} The date of the last time birthdays were checked.
 */
export function getLastBirthdayChecked() {
  return lastBirthdayChecked;
}

/**
 * Check if birthday checked today
 * @returns {boolean} was birthday checked today
 */
export function isBirthdayCheckedToday() {
    const today = new Date();
    return (
        lastBirthdayChecked.getFullYear() === today.getFullYear() &&
        lastBirthdayChecked.getMonth() === today.getMonth() &&
        lastBirthdayChecked.getDate() === today.getDate()
    );
}