'use client';

import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const sparkleDots = [
  { top: '18%', left: '72%', opacity: 0.12 },
  { top: '12%', left: '88%', opacity: 0.3 },
  { top: '8%', left: '90%', opacity: 0.12 },
  { top: '16%', left: '46%', opacity: 0.12 },
  { top: '14%', left: '22%', opacity: 0.3 },
  { top: '36%', left: '8%', opacity: 0.12 },
  { top: '22%', left: '71%', opacity: 0.3 },
  { top: '60%', left: '17%', opacity: 0.3 },
  { top: '78%', left: '20%', opacity: 0.12 },
  { top: '78%', left: '28%', opacity: 0.12 },
  { top: '62%', left: '38%', opacity: 0.12 },
  { top: '48%', left: '48%', opacity: 0.12 },
  { top: '72%', left: '52%', opacity: 0.12 },
  { top: '82%', left: '59%', opacity: 0.3 },
];

type ButtonPrimaryProps = {
  children?: ReactNode;
  href?: string;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>;

function ButtonSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'relative inline-flex h-[53px] min-w-[159px] items-center justify-center overflow-hidden rounded-[110px] bg-[#22464d] p-[2px]',
        className
      )}
    >
      <span
        className={cn(
          'relative flex h-full w-full items-center justify-center overflow-hidden rounded-[110px] px-7'
        )}
      >
        {/* Inner background */}
        <span className="absolute inset-0 rounded-[110px] bg-[#4FA1AF]" />
        {/* Blur that expands from normal size to fill the whole button on hover */}
        <span
          aria-hidden
          className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 h-[25px] w-[97px] rounded-full bg-[#6ccada] blur-[7px] group-hover:bottom-0 group-hover:left-0 group-hover:-translate-x-0 group-hover:-translate-y-0 group-hover:h-full group-hover:w-full transition-all duration-300"
        />
        {/* Sparkles */}
        <span aria-hidden>
          {sparkleDots.map((dot, index) => (
            <span
              key={`${dot.top}-${dot.left}-${index}`}
              className="absolute h-px w-px rounded-full bg-white"
              style={{
                top: dot.top,
                left: dot.left,
                opacity: dot.opacity,
              }}
            />
          ))}
        </span>
        <span className="font-instrument-serif relative z-10 text-xl leading-none whitespace-nowrap text-white">
          {children}
        </span>
      </span>
    </span>
  );
}

export function ButtonPrimary({
  children = 'Get Started',
  href,
  className,
  type = 'button',
  disabled,
  ...props
}: ButtonPrimaryProps) {
  const focusClass =
    'group inline-flex rounded-[110px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22464d] disabled:pointer-events-none disabled:opacity-60';

  if (href && !disabled) {
    return (
      <Link href={href} className={cn(focusClass, className)}>
        <ButtonSurface>{children}</ButtonSurface>
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(focusClass, 'cursor-pointer', className)}
      {...props}
    >
      <ButtonSurface>{children}</ButtonSurface>
    </button>
  );
}

export default ButtonPrimary;
