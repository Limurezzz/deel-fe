import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { testData as mockTestData } from '../../mocks/testData';

import SearchPage from './index';

jest.mock('../../queries', () => {
  return {
    getMockDataQuery: () => Promise.resolve(mockTestData),
  }
});

test('renders mock list', async () => {
  await act(async () => render(<SearchPage />));
  const linkElement = screen.getByText(/Unity Caldwell/i);
  expect(linkElement).toBeInTheDocument();
});
