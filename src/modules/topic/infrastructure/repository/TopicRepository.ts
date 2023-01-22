import { collection, getDocs, addDoc } from 'firebase/firestore';
import db from '@/shared/firebase/DbSetup';

export type Topic = {
	id?: string;
	description: string;
	title: string;
	likes: number;
};

const getTopics = async (): Promise<Topic[]> => {
	const qs = await getDocs(collection(db, 'topics'));
	return qs.docs.map<Topic>((doc) => {
		return {
			id: doc.id,
			...doc.data()
		} as Topic;
	});
};

const createTopic = async (topic: Topic): Promise<Topic> => {
	const doc = await addDoc(collection(db, 'topics'), topic);

	return {
		...topic,
		id: doc.id
	};
};

const addTopicLike = async (id: string) => {
	const response = await fetch(
		'https://europe-west6-most-voted-topics.cloudfunctions.net/add-like-to-topic',
		{
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				id
			})
		}
	);

	return response.json();
};

export { getTopics, addTopicLike, createTopic };
