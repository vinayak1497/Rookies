import { cn } from "@/lib/utils";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;
}

export function SectionWrapper({ children, className, ...props }: SectionWrapperProps) {
    return (
        <section
            className={cn("py-16 sm:py-20 lg:py-24", className)}
            {...props}
        >
            {children}
        </section>
    );
}
