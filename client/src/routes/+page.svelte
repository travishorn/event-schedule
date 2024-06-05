<script>
	import { onMount } from 'svelte';
	import { parseScheduleString } from '$lib';

	/** @type {App.ScheduledEvent[]} */
	let schedule = [];

	onMount(() => {
		const scheduleSource = new EventSource('http://localhost:3000/schedule');
		scheduleSource.onmessage = function (newSchedule) {
			schedule = parseScheduleString(newSchedule.data);
		};
	});
</script>

<pre>{JSON.stringify(schedule, null, 2)}</pre>
