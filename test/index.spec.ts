import Index from '@/routes/+page.svelte';
import { findByText, render, waitFor } from '@testing-library/svelte';
import {
	getTopics,
	addTopicLike,
	createTopic,
	type Topic
} from '@/modules/topic/infrastructure/repository/TopicRepository';
import userEvent from '@testing-library/user-event';

const mockGetTopics = getTopics as jest.MockedFunction<typeof getTopics>;
const mockedAddTopicLike = addTopicLike as jest.MockedFunction<typeof addTopicLike>;
const mockedCreateTopic = createTopic as jest.MockedFunction<typeof createTopic>;
jest.mock('@/modules/topic/infrastructure/repository/TopicRepository');
jest.mock('@/shared/firebase/DbSetup', () => ({ db: jest.fn() }));

describe('Topics Page', () => {
	beforeEach(() => {
		mockGetTopics.mockClear();
	});

	describe('topic list', () => {
		it('should render topic list with one item', async () => {
			const topic: Topic = {
				description: 'test description',
				title: 'test title',
				likes: 3,
				id: 'abc'
			};

			mockGetTopics.mockResolvedValueOnce([topic]);

			const { getByTestId, findByText } = render(Index);

			expect(getByTestId('topic-container')).toBeInTheDocument();
			expect(await findByText(topic.title)).toBeInTheDocument();
		});

		it.skip("should show no items when there's no topics", () => {});

		it('likes clicked topic', async () => {
			const id = 'abc-bca';

			mockGetTopics.mockResolvedValueOnce([
				{
					description: 'test description',
					title: 'test title',
					likes: 3,
					id
				}
			]);

			const { findByTestId } = render(Index);

			const likeBtn = await findByTestId('like-btn');
			await userEvent.click(likeBtn);

			expect(mockedAddTopicLike).toHaveBeenCalledWith(id);
		});
	});

	describe('topic creation', () => {
		it('should render title form group', () => {
			const { getByTestId } = render(Index);

			expect(getByTestId('title-input')).toBeInTheDocument();
			expect(getByTestId('title-label')).toBeInTheDocument();
		});

		it('should render description form group', () => {
			const { getByTestId } = render(Index);

			expect(getByTestId('description-input')).toBeInTheDocument();
			expect(getByTestId('description-label')).toBeInTheDocument();
		});

		it('should render submit button', () => {
			const { getByTestId } = render(Index);

			expect(getByTestId('submit-button')).toBeInTheDocument();
		});

		it('should add new item to firestore when clicking on submit', async () => {
			const title = 'title test';
			const description = 'should write a description';

			mockedCreateTopic.mockResolvedValueOnce({
				title,
				description,
				id: 'abc-cba',
				likes: 0
			});

			const { getByTestId, findByText } = render(Index);

			const titleEl = getByTestId('title-input');
			await userEvent.type(titleEl, title);

			const descriptionEl = getByTestId('description-input');
			await userEvent.type(descriptionEl, description);

			const submitBtn = getByTestId('submit-button');
			await userEvent.click(submitBtn);

			expect(await findByText(title)).toBeInTheDocument();
			expect(await findByText(description)).toBeInTheDocument();
			expect(mockedCreateTopic).toHaveBeenCalledWith({
				title,
				description,
				likes: 0
			});
		});

		it('should reset inputs when clicking on submit', async () => {
			const title = 'title test';
			const description = 'should write a description';

			mockedCreateTopic.mockResolvedValueOnce({
				title,
				description,
				id: 'abc-cba',
				likes: 0
			});

			const { getByTestId } = render(Index);

			const titleEl = getByTestId('title-input');
			await userEvent.type(titleEl, title);

			const descriptionEl = getByTestId('description-input');
			await userEvent.type(descriptionEl, description);

			await waitFor(() => {
				expect(getByTestId('title-input')).toHaveValue(title);
				expect(getByTestId('description-input')).toHaveValue(description);
			});

			const submitBtn = getByTestId('submit-button');
			await userEvent.click(submitBtn);

			await waitFor(() => {
				expect(getByTestId('title-input')).toHaveValue('');
				expect(getByTestId('description-input')).toHaveValue('');
			});
		});

		it.skip('should be able to add like when created topic has been added to list', () => {});
	});
});
