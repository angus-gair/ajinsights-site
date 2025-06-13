import React, { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * If true, the button will take up the full width of its container
   */
  fullWidth?: boolean;
  /**
   * If true, the button will show a loading spinner
   */
  isLoading?: boolean;
  /**
   * The size of the button
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
}

const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $fullWidth: boolean;
  $size: 'small' | 'medium' | 'large';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
  white-space: nowrap;
  
  /* Size variants */
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return 'padding: 6px 12px; font-size: 0.875rem;';
      case 'large':
        return 'padding: 12px 24px; font-size: 1.125rem;';
      case 'medium':
      default:
        return 'padding: 8px 16px; font-size: 1rem;';
    }
  }}
  
  /* Full width */
  ${({ $fullWidth }) => $fullWidth && 'width: 100%;'}
  
  /* Variant styles */
  ${({ theme, $variant }) => {
    switch ($variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.gray[200]};
          color: ${theme.colors.gray[800]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[300]};
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          border-color: ${theme.colors.gray[300]};
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray[100]};
          }
        `;
      case 'danger':
        return `
          background-color: ${theme.colors.red[600]};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.red[700]};
          }
        `;
      case 'primary':
      default:
        return `
          background-color: ${theme.colors.blue[600]};
          color: white;
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.blue[700]};
          }
        `;
    }
  }}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Loader = styled.span`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

/**
 * A customizable button component with multiple variants and sizes.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  size = 'medium',
  disabled = false,
  ...props
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      $variant={variant}
      $fullWidth={fullWidth}
      $size={size}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader aria-hidden="true" />}
      {children}
    </StyledButton>
  );
});

Button.displayName = 'Button';

export default Button;
