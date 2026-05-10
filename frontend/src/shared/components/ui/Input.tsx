import { forwardRef, useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, value, defaultValue, onChange, onFocus, onBlur, rightElement, ...rest }, ref) => {
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');
    const inputId = id ?? `bk-input-${Math.random().toString(36).slice(2)}`;
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;
    const hasValue = String(currentValue).length > 0;
    // date inputs always show browser format hint (mm/dd/yyyy) so keep label floated
    const { placeholder, type, ...inputRest } = rest;
    const isDate = type === 'date';
    const floated = focused || hasValue || isDate;

    return (
      <div className={cn('flex flex-col gap-1', className)}>
        <div className="relative h-12">
          {label && (
            <label
              htmlFor={inputId}
              className={cn(
                'absolute left-3.5 z-10 pointer-events-none font-sans transition-all duration-150',
                floated
                  ? 'top-1.5 text-[10px] font-semibold tracking-wider uppercase'
                  : 'top-1/2 -translate-y-1/2 text-sm font-normal',
                error
                  ? 'text-semantic-error'
                  : focused
                  ? 'text-accent-indigo'
                  : 'text-text-muted'
              )}
            >
              {label}
            </label>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            value={isControlled ? value : internalValue}
            placeholder={floated ? placeholder : ''}
            onChange={(e) => {
              if (!isControlled) setInternalValue(e.target.value);
              onChange?.(e);
            }}
            onFocus={(e) => { setFocused(true); onFocus?.(e); }}
            onBlur={(e) => { setFocused(false); onBlur?.(e); }}
            className={cn(
              'absolute inset-0 w-full h-full bg-bg-surface rounded-md font-sans text-sm text-text-primary outline-none transition-all duration-150',
              label ? 'pt-5 pb-1.5 px-3.5' : 'px-3.5',
              rightElement && 'pr-10',
              error
                ? 'border border-semantic-error focus:ring-2 focus:ring-semantic-error/15'
                : 'border border-border-default focus:border-accent-indigo focus:ring-2 focus:ring-accent-indigo/15'
            )}
            {...inputRest}
          />
          {rightElement && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-semantic-error font-sans">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted font-sans">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
