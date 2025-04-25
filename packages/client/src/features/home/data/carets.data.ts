type CaretConfig = {
    id: string;
    name: string;
    color: string;
    speed: number;
    basePosition: number;
    content: string;
};

export const carets: CaretConfig[] = [
    {
        id: 'caret1',
        name: 'Haley',
        color: 'blue',
        speed: 200,
        basePosition: 330,
        content: `type CaretConfig = {\n\tname: string;\n\tcolor: string;\n\tcontent: string;\n};`,
    },
    {
        id: 'caret2',
        name: 'Alex',
        color: 'green',
        speed: 300,
        basePosition: 5000,
        content: `\n\nconst carets: CaretConfig[] = [\n\t{\n\t\tname: 'Haley',\n\t\tcolor: 'blue',\n\t\tcontent: 'Infinite Loop 1',\n\t},\n\t{\n\t\tname: 'Alex',\n\t\tcolor: 'green',\n\t\tcontent: 'Infinite Loop 2',\n\t},\n];\n\nexport default carets;`,
    },
];  