import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the ScholarVenue research recommender', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', {
    name: /find where your ideas belong/i,
    level: 1
  });
  expect(headingElement).toBeInTheDocument();
});
