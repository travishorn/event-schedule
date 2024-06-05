// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		interface BaseScheduledEvent {
			id: string;
			title: string;
			presenter: string;
			completed: boolean;
			active: boolean;
		}

		interface RawScheduledEvent extends BaseScheduledEvent {
			date: string;
		}
		
		interface ScheduledEvent extends BaseScheduledEvent {
			date: Date;
		}
	}
}

export {};
