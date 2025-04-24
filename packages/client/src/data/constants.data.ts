export const constantsJSON = {
    websiteName: "CodeSync",
    navbarHeight: "64px",
    activityDockWidth: "48px",
    dynamicPanelWidth: "240px",
    terminalPanelHeight: "300px",
    engagementPanelWidth: "360px",
    settingsSidebarWidth: "240px",
    scrollPt: 64,
    transitionDuration: 600,
    transitionDurationMs: "600ms",
    mobileBreakpoint: 768,
    userColors: [
        "#b91c1c",
        "#ea580c",
        "#f59e0b",
        "#84cc16",
        "#16a34a",
        "#14b8a6",
        "#0891b2",
        "#0369a1",
        "#1e3a8a",
        "#312e81",
        "#6d28d9",
        "#7e22ce",
        "#86198f",
        "#9d174d",
        "#f43f5e",
        "#e11d48",
        "#64748b",
        "#d946ef",
        "#365314",
        "#831843"
    ],
    editorThemes: [
        {
            value: "abcdef",
            label: "ABCDEF"
        },
        {
            value: "abyss",
            label: "Abyss"
        },
        {
            value: "androidstudio",
            label: "Android Studio"
        },
        {
            value: "andromeda",
            label: "Andromeda"
        },
        {
            value: "atomone",
            label: "Atom One"
        },
        {
            value: "aura",
            label: "Aura"
        },
        {
            value: "bbedit",
            label: "BBEdit"
        },
        {
            value: "bespin",
            label: "Bespin"
        },
        {
            value: "copilot",
            label: "Copilot"
        },
        {
            value: "darcula",
            label: "Darcula"
        },
        {
            value: "dracula",
            label: "Dracula"
        },
        {
            value: "eclipse",
            label: "Eclipse"
        },
        {
            value: "kimbie",
            label: "Kimbie"
        },
        {
            value: "githubLight",
            label: "GitHub Light"
        },
        {
            value: "githubDark",
            label: "GitHub Dark"
        },
        {
            value: "material",
            label: "Material"
        },
        {
            value: "monokai",
            label: "Monokai"
        },
        {
            value: "nord",
            label: "Nord"
        },
        {
            value: "okaidia",
            label: "Okaidia"
        },
        {
            value: "quietlight",
            label: "Quiet Light"
        },
        {
            value: "red",
            label: "Red"
        },
        {
            value: "solarizedLight",
            label: "Solarized Light"
        },
        {
            value: "solarizedDark",
            label: "Solarized Dark"
        },
        {
            value: "sublime",
            label: "Sublime"
        },
        {
            value: "tokyoNightDay",
            label: "Tokyo Night Day"
        },
        {
            value: "tokyoNightStorm",
            label: "Tokyo Night Storm"
        },
        {
            value: "tokyoNight",
            label: "Tokyo Night"
        },
        {
            value: "tomorrowNightBlue",
            label: "Tomorrow Night Blue"
        },
        {
            value: "vscodeDark",
            label: "VS Code Dark"
        },
        {
            value: "vscodeLight",
            label: "VS Code Light"
        },
        {
            value: "whiteLight",
            label: "White Light"
        },
        {
            value: "whiteDark",
            label: "White Dark"
        },
        {
            value: "xcodeLight",
            label: "Xcode Light"
        },
        {
            value: "xcodeDark",
            label: "Xcode Dark"
        }
    ],
    languages: [
        {
            languageNumber: "1",
            value: "csharp-v2.9.0.63208",
            label: "C#",
            version: "v2.9.0.63208",
            extension: ".cs",
            boilerPlateCode: "// Progman.Program.Main is the entry point for your code. Don't change it.\r\n// Microsoft (R) Visual C# Compiler version 2.9.0.63208 (958f2354)\r\n\r\nusing System;\r\nusing System.Collections.Generic;\r\nusing System.Linq;\r\nusing System.Text.RegularExpressions;\r\n\r\nnamespace Progman\r\n{\r\n\tpublic class Program\r\n\t{\r\n\t\tpublic static void Main(string[] args)\r\n\t\t{\r\n\t\t\t// Your code goes here\r\n\t\t\tConsole.WriteLine(\"Hello, world!\");\r\n\t\t}\r\n\t}\r\n}"
        },
        {
            languageNumber: "4",
            value: "java-v11.0.5",
            label: "Java",
            version: "v11.0.5",
            extension: ".java",
            boilerPlateCode: "// 'main' method must be in a class 'Progman'.\n// openjdk version '11.0.5'\n\nimport java.util.*;\nimport java.lang.*;\n\nclass Progman\n{\n\tpublic static void main(String args[])\n\t\t{\n\t\t\tSystem.out.println('Hello, World!');\n\t\t}\n}"
        },
        {
            languageNumber: "5",
            value: "python-v2.7.17",
            label: "Python",
            version: "v2.7.17",
            extension: ".py",
            boilerPlateCode: "# Python 2.7.17\nprint 'Hello, world!'"
        },
        {
            languageNumber: "6",
            value: "c-v7.4.0",
            label: "C (gcc)",
            version: "v7.4.0",
            extension: ".c",
            boilerPlateCode: "// gcc 7.4.0\r\n\r\n#include <stdio.h>\r\n\r\nint main(void)\r\n{\r\n\tprintf(\"Hello, world!\\n\");\r\n\treturn 0;\r\n}"
        },
        {
            languageNumber: "7",
            value: "cpp-v7.4.0",
            label: "C++ (gcc)",
            version: "v7.4.0",
            extension: ".cpp",
            boilerPlateCode: "// g++  7.4.0\r\n\r\n#include <iostream>\r\n\r\nint main()\r\n{\r\n\tstd::cout << \"Hello, world!\\n\";\r\n}"
        },
        {
            languageNumber: "8",
            value: "php-v7.2.24",
            label: "PHP",
            version: "v7.2.24",
            extension: ".php",
            boilerPlateCode: "// php 7.2.24\r\n<?php \r\n\r\necho \"Hello, world! \"\r\n\r\n?>"
        },
        {
            languageNumber: "11",
            value: "haskell-v8.0.2",
            label: "Haskell",
            version: "v8.0.2",
            extension: ".hs",
            boilerPlateCode: "-- ghc 8.0.2\r\n\r\nmain = print $ \"Hello, world!\""
        },
        {
            languageNumber: "12",
            value: "ruby-v2.5.1",
            label: "Ruby",
            version: "v2.5.1",
            extension: ".rb",
            boilerPlateCode: "# ruby 2.5.1 \r\n\r\nputs \"Hello, world!\""
        },
        {
            languageNumber: "13",
            value: "perl-v5.26.1",
            label: "Perl",
            version: "v5.26.1",
            extension: ".pl",
            boilerPlateCode: "# perl 5.26.1 \r\n\r\nprint \"Hello World\\n\";"
        },
        {
            languageNumber: "17",
            value: "javascript-v8.10.0",
            label: "Javascript",
            version: "v8.10.0",
            extension: ".js",
            boilerPlateCode: "// nodejs v8.10.0\r\n\r\nconsole.log(\"Hello, World!\");"
        },
        {
            languageNumber: "60",
            value: "typescript-v8.10.0",
            label: "TypeScript",
            version: "v8.10.0",
            extension: ".ts",
            boilerPlateCode: "// nodejs v8.10.0\r\n\r\nconsole.log(\"Hello, World!\");"
        },
        {
            languageNumber: "20",
            value: "go-v1.10.4",
            label: "Golang",
            version: "v1.10.4",
            extension: ".go",
            boilerPlateCode: "// go 1.10.4\r\n\r\npackage main  \r\nimport \"fmt\" \r\n\r\nfunc main() { \r\n\tfmt.Printf(\"hello, world\\n\") \r\n}"
        },
        {
            languageNumber: "21",
            value: "scala-v2.13.1",
            label: "Scala",
            version: "v2.13.1",
            extension: ".scala",
            boilerPlateCode: "// 'Progman' class is the entry point for your code.\r\n// Don't declare a package.\r\n// scala 2.13.1\r\n\r\nobject Progman extends App {\r\n\tprintln('Hello, World!')\r\n }"
        },
        {
            languageNumber: "37",
            value: "swift-v5.1.5",
            label: "Swift",
            version: "v5.1.5",
            extension: ".swift",
            boilerPlateCode: "// swift 5.1.5\r\n\r\nprint(\"Hello, world!\")"
        },
        {
            languageNumber: "43",
            value: "kotlin-v1.1",
            label: "Kotlin",
            version: "v1.1",
            extension: ".kt",
            boilerPlateCode: "// Kotlin 1.1\r\n\r\nfun main(args: Array<String>) {\r\n\tprintln(\"Hello, world!\")\r\n}"
        }
    ]
};