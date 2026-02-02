import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

// Union of generic HTML button props and Framer Motion props
type ButtonProps = HTMLMotionProps<"button"> & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: React.ReactNode;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {

        const variants = {
            primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30",
            secondary: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30",
            outline: "border border-white/20 bg-white/5 hover:bg-white/10 text-white",
            ghost: "hover:bg-white/5 text-gray-300 hover:text-white"
        };

        const sizes = {
            sm: "h-8 px-3 text-xs",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-6 text-lg"
        };

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: 0.98 }}
                className={cn(
                    "relative inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                disabled={isLoading}
                {...props}
            >
                {isLoading && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    </div>
                )}
                <span className={cn(isLoading && "pl-5")}>{children}</span>
            </motion.button>
        );
    }
);
Button.displayName = "Button";
