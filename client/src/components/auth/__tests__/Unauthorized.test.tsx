import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Unauthorized from '../Unauthorized';

describe('Unauthorized', () => {
  it('renders unauthorized message and home link', () => {
    render(
      <BrowserRouter>
        <Unauthorized />
      </BrowserRouter>
    );

    // Check if the unauthorized message is displayed
    expect(screen.getByText('Brak dostępu')).toBeInTheDocument();
    expect(screen.getByText('Nie masz uprawnień do wyświetlenia tej strony')).toBeInTheDocument();

    // Check if the home link is present
    const homeLink = screen.getByText('Wróć do strony głównej');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });
}); 