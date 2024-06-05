/**
 * @param {App.RawScheduledEvent} event
 * @returns {App.ScheduledEvent}
 */
function parseEvent(event) {
	return {
		...event,
		date: new Date(event.date)
	};
}

/**
 * @param {string} string
 * @returns {App.ScheduledEvent[]}
 */
export function parseScheduleString(string) {
	return JSON.parse(string).map(parseEvent);
}
