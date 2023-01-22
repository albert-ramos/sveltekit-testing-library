module.exports = {
	// eslint-disable-next-line no-undef
	getApps: jest.fn(() => []),
	// eslint-disable-next-line no-undef
	initializeApp: jest.fn(),
	// eslint-disable-next-line no-undef
	getApp: jest.fn(),
	// eslint-disable-next-line no-undef
	getFirestore: jest.fn(() => ({
		// eslint-disable-next-line no-undef
		collection: jest.fn()
	})),
	// eslint-disable-next-line no-undef
	collection: jest.fn(() => ({
		// eslint-disable-next-line no-undef
		withConverter: jest.fn()
	}))
};
