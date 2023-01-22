import {
	addTopicLike,
	createTopic,
	type Topic
} from '@/modules/topic/infrastructure/repository/TopicRepository';
import { addDoc, collection } from 'firebase/firestore';
import db from '@/shared/firebase/DbSetup';

jest.mock('@/shared/firebase/DbSetup', () => ({ db: jest.fn() }));
jest.mock('firebase/firestore', () => ({
	addDoc: jest.fn(),
	collection: jest.fn()
}));

describe('TopicRepository', () => {
	it('should call firestore addDoc fn with given arguments when createTopic is called', async () => {
		const collectionData = {
			id: 'topics',
			path: 'topics',
			type: 'collection',
			parent: null,
			withConverter: jest.fn(),
			converter: jest.fn(),
			firestore: jest.fn()
		};

		const expectedDocResponse: Pick<Topic, 'id'> = {
			id: 'id'
		};

		const expectedTopicToBeCreated: Omit<Topic, 'id'> = {
			title: 'title to be created',
			description: 'description example',
			likes: 0
		};

		const expectedTopic: Topic = {
			...expectedTopicToBeCreated,
			...expectedDocResponse
		};

		(collection as jest.Mock).mockReturnValue(collectionData);
		(addDoc as jest.Mock).mockReturnValue(expectedTopic);

		const createdDoc = await createTopic(expectedTopicToBeCreated);

		expect(collection).toHaveBeenCalledWith(db, 'topics');
		expect(addDoc).toHaveBeenCalledWith(collectionData, expectedTopicToBeCreated);
		expect(createdDoc).toEqual(expectedTopic);
	});
	it('should call fetch with given arguments when calling addTopicLike()', async () => {
		const id = 'abc-cda';

		const init = {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				id
			})
		};

		const expectedResponse = { topic: { likes: 0, title: 'new', description: 'topic' } };
		const fetchMock = jest.fn().mockImplementation(() =>
			Promise.resolve({
				json: () => Promise.resolve(expectedResponse)
			})
		);

		global.fetch = fetchMock;

		const likeResponse = await addTopicLike(id);

		expect(fetchMock).toHaveBeenCalledWith(
			'https://europe-west6-most-voted-topics.cloudfunctions.net/add-like-to-topic',
			init
		);
		expect(likeResponse).toEqual(expectedResponse);
	});
});
