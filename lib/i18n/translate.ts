export type Messages = Record<string, string>;

export type InterpolationValues = Record<string, string | number>;

function interpolate(template: string, values?: InterpolationValues) {
    if (!values) return template;
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        if (values[key] === undefined || values[key] === null) return match;
        return String(values[key]);
    });
}

export function createTranslator(messages: Messages, fallbackMessages?: Messages) {
    return (key: string, values?: InterpolationValues) => {
        const template = messages[key] ?? fallbackMessages?.[key] ?? key;
        return interpolate(template, values);
    };
}
