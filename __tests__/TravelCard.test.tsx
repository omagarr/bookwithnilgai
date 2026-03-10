import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TravelCard from '../src/components/TravelCard';

describe('TravelCard', () => {
  const defaultProps = {
    price: '€189',
    priceSubtext: '/ person',
    buttonLabel: 'Select',
    onSelect: jest.fn(),
    children: <div>Card content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children content', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders price and subtext', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByText('€189')).toBeInTheDocument();
    expect(screen.getByText('/ person')).toBeInTheDocument();
  });

  it('renders button with correct label', () => {
    render(<TravelCard {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Select' })).toBeInTheDocument();
  });

  it('calls onSelect when button is clicked', () => {
    render(<TravelCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select' }));
    expect(defaultProps.onSelect).toHaveBeenCalledTimes(1);
  });

  it('calls onSelect when card is clicked', () => {
    render(<TravelCard {...defaultProps} />);
    fireEvent.click(screen.getByText('Card content'));
    expect(defaultProps.onSelect).toHaveBeenCalled();
  });

  it('renders badge when provided', () => {
    render(<TravelCard {...defaultProps} badge={{ text: 'Direct', variant: 'green' }} />);
    expect(screen.getByText('Direct')).toBeInTheDocument();
  });

  it('shows Selected state when selected', () => {
    render(<TravelCard {...defaultProps} selected={true} />);
    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Select' })).not.toBeInTheDocument();
  });

  it('does not call onSelect when selected', () => {
    render(<TravelCard {...defaultProps} selected={true} />);
    // Card should have pointer-events-none when selected
    const card = screen.getByText('Card content').closest('.travel-card-enter');
    expect(card?.className).toContain('pointer-events-none');
  });

  it('applies animation delay', () => {
    render(<TravelCard {...defaultProps} animationDelay={300} />);
    const card = screen.getByText('Card content').closest('.travel-card-enter');
    expect(card?.getAttribute('style')).toContain('animation-delay: 300ms');
  });
});
