import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ScholarVenue analyzer', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', {
    name: /research paper analyzer/i,
    level: 1
  });
  expect(headingElement).toBeInTheDocument();
});
