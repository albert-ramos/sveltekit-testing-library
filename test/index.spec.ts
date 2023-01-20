import Index from '@/routes/+page.svelte';
import { render } from '@testing-library/svelte';

test('Welcome the user', () => {
	const { getByText } = render(Index);

	expect(getByText('Not found in component')).toBeInTheDocument();
});
