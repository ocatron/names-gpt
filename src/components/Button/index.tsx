import classNames from 'classnames';
import {
  ComponentPropsWithRef,
  ForwardedRef,
  ReactElement,
  ReactNode,
  createElement,
  forwardRef,
} from 'react';
import styles from './style.module.css';

type AsType = 'a' | 'button';

type Props<E extends AsType> = {
  as?: E;
  variant?: 'filled' | 'outlined' | 'text';
  size?: 'sm' | 'md' | 'lg';
  square?: boolean;
  circle?: boolean;
  fullWidth?: boolean;
  color?: string;
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  children?: ReactNode;
} & ComponentPropsWithRef<E>;

type ButtonComponentType = <E extends AsType = 'button'>(
  props: Props<E>
) => ReactElement | null;

const Button = forwardRef(
  <E extends AsType>(
    {
      as,
      variant = 'filled',
      size = 'md',
      square = false,
      circle = false,
      fullWidth = false,
      color = 'blue',
      leftIcon,
      rightIcon,
      children,
      className,
      ...rest
    }: Props<E>,
    ref?: ForwardedRef<E>
  ) => {
    const element = as || 'button';
    className = classNames(
      styles.btn,
      styles[size],
      square && styles.square,
      circle && styles.circle,
      fullWidth && styles.fullWidth,
      styles[variant],
      styles[color],
      className
    );

    children = (
      <span className="flex min-h-[1.5rem] min-w-[1.5rem] items-center justify-center gap-2">
        {leftIcon && (
          <span className={classNames(!square && !circle && '-ml-1')}>
            {leftIcon}
          </span>
        )}
        {children}
        {rightIcon && (
          <span className={classNames(!square && !circle && '-mr-1')}>
            {rightIcon}
          </span>
        )}
      </span>
    );

    return createElement(element, { ...rest, className, ref }, children);
  }
);

Button.displayName = 'Button';
export default Button as ButtonComponentType;
