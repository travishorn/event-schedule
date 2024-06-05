<script>
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { parseScheduleString } from '$lib';

	/** @type {App.ScheduledEvent[]} */
	let schedule = [];

	/** @param {number} activeIndex */
	function setActive(activeIndex) {
		schedule = schedule.map((event, i) => {
			return {
				...event,
				active: i === activeIndex
			};
		});
	}

	onMount(() => {
		const scheduleSource = new EventSource('http://localhost:3000/schedule');
		scheduleSource.onmessage = function (newSchedule) {
			schedule = parseScheduleString(newSchedule.data);
		};
	});
</script>

<svelte:head>
	<title>Admin | Event Schedule</title>
</svelte:head>

<table>
	<thead>
		<th>Date</th>
		<th>Title</th>
		<th>Presenter</th>
		<th>Completed</th>
		<th>Active</th>
	</thead>
	<tbody>
		{#each schedule as event, i}
			<tr>
				<td
					><input
						value={event.date.toLocaleString('sv')}
						on:input={(e) => (schedule[i].date = new Date(e.target.value))}
						type="datetime-local"
					/></td
				>
				<td><input bind:value={event.title} /></td>
				<td><input bind:value={event.presenter} /></td>
				<td><input bind:checked={event.completed} type="checkbox" /></td>
				<td
					><input
						checked={event.active}
						on:input={() => setActive(i)}
						type="radio"
						name="active"
					/></td
				>
			</tr>
		{/each}
	</tbody>
</table>

<form
	method="post"
	action="http://localhost:3000/schedule"
	use:enhance={({ formData }) => {
		formData.append('schedule', JSON.stringify(schedule));
	}}
>
	<button>Save</button>
</form>
