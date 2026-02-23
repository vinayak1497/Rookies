import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    hint?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, hint, id, className, ...props }, ref) => {
        const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

        return (
            <div className="space-y-1.5">
                <label
                    htmlFor={inputId}
                    className="block text-sm font-medium text-foreground"
                >
                    {label}
                </label>
                <Input
                    id={inputId}
                    ref={ref}
                    className={cn(
                        error && "border-destructive focus-visible:ring-destructive",
                        className
                    )}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-muted-foreground">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-destructive">{error}</p>
                )}
            </div>
        );
    }
);
FormInput.displayName = "FormInput";

export { FormInput };
