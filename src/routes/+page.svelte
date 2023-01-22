<script lang="ts">
	import { onMount } from 'svelte';
	import {
		addTopicLike,
		createTopic,
		getTopics,
		type Topic
	} from '@/modules/topic/infrastructure/repository/TopicRepository';

	let topics: Topic[] = [];

	onMount(async () => {
		topics = (await getTopics()) || [];
	});

	const onLike = (id: string) => {
		try {
			addTopicLike(id);
			const topicLiked = topics.find((t) => t.id == id);
			topicLiked.likes = topicLiked.likes + 1;
			topics = [...topics];
		} catch (e) {
			console.error(e);
		}
	};

	let titleInput = '';
	let descriptionInput = '';

	const addTopic = async () => {
		const newTopic: Topic = {
			title: titleInput,
			description: descriptionInput,
			likes: 0
		};

		try {
			const createdTopic = await createTopic(newTopic);

			topics = [createdTopic, ...topics];

			titleInput = '';
			descriptionInput = '';
		} catch (e) {
			console.log(e);
		}
	};
</script>

<svelte:head>
	<title>¿De qué temas quereis hablar?</title>
</svelte:head>

<div class="flex flex-col container max-w-md mt-10 mx-auto w-full justify-center">
	<form on:submit|preventDefault={addTopic}>
		<div>
			<label
				data-testid="title-label"
				for="title-input"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label
			>
			<input
				bind:value={titleInput}
				data-testid="title-input"
				type="text"
				id="title-input"
				class="block w-full p-3 text-gray-900 rounded-lg sm:text-xs dark:bg-opacity-30 dark:bg-gray-100 border-none dark:border-b-gray-600 dark:placeholder-gray-400 dark:text-black outline-0 dark:focus:shadow-md"
			/>
		</div>
		<div class="my-5">
			<label
				data-testid="description-label"
				for="description-input"
				class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label
			>
			<textarea
				bind:value={descriptionInput}
				data-testid="description-input"
				id="description-input"
				rows="4"
				class="block w-full p-3 text-gray-900 rounded-lg sm:text-xs dark:bg-opacity-30 dark:bg-gray-100 border-none dark:border-b-gray-600 dark:placeholder-gray-400 dark:text-black outline-0 dark:focus:shadow-md"
			/>
		</div>
		<div class="flex justify-end">
			<button
				type="submit"
				data-testid="submit-button"
				class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
			>
				Añadir +
			</button>
		</div>
	</form>
</div>

<div
	class="flex flex-col container max-w-md mt-10 mx-auto w-full items-center justify-center"
	data-testid="topic-container"
>
	<ul class="flex flex-col w-full">
		{#each topics as { id, description, title, likes }, i}
			<li class="flex flex-row mb-4">
				<div
					class="select-none flex flex-1 items-center p-4 rounded-lg bg-white dark:bg-gray-800 dark:hover:bg-gray-900 "
				>
					<div class="flex-1 pl-1">
						<div class="font-medium dark:text-white">{title}</div>
						<div class="text-gray-600 dark:text-gray-200 text-sm mr-2">{description}</div>
					</div>
					<div class="flex flex-row justify-center">
						<div class="text-gray-600 dark:text-gray-200 text-xs ml-2">{likes} likes</div>
						<button
							class="w-10 text-right flex justify-end"
							data-testid="like-btn"
							on:click={() => onLike(id)}
						>
							<svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
								><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
									id="SVGRepo_tracerCarrier"
									stroke-linecap="round"
									stroke-linejoin="round"
								/><g id="SVGRepo_iconCarrier">
									<path
										d="M12.7692 6.70483C9.53846 2.01902 4 3.90245 4 8.68256C4 13.4627 13.2308 20 13.2308 20C13.2308 20 22 13.2003 22 8.68256C22 4.16479 16.9231 2.01903 13.6923 6.70483L13.2308 7.0791L12.7692 6.70483Z"
										class="fill-purple-500"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g></svg
							>
						</button>
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>
