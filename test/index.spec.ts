import Index from '@/routes/+page.svelte';
import { render } from '@testing-library/svelte';
import { getTopics } from '@/modules/topic/infrastructure/repository/TopicRepository';

const mockGetTopics = getTopics as jest.MockedFunction<typeof getTopics>;
jest.mock('@/modules/topic/infrastructure/repository/TopicRepository');
jest.mock('@/shared/firebase/DbSetup', () => ({ db: jest.fn() }));

describe('Page', () => {
	beforeEach(() => {
		mockGetTopics.mockClear();
	});

	it('renders', async () => {
		mockGetTopics.mockResolvedValueOnce([
			{
				description: 'test',
				title: 'testtitle',
				likes: 3,
				id: 'abc'
			}
		]);
		const { getByTestId, findByText } = render(Index);

		expect(getByTestId('topic-container')).toBeInTheDocument();
		expect(await findByText('testtitle')).toBeInTheDocument();
	});
});
