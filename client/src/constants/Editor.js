const LANGUAGES = [
    { languageNumber: "1", label: "C#", boilerPlateCode: `// Progman.Program.Main is the entry point for your code. Don\'t change it.\r\n// Microsoft (R) Visual C# Compiler version 2.9.0.63208 (958f2354)\r\n\r\nusing System;\r\nusing System.Collections.Generic;\r\nusing System.Linq;\r\nusing System.Text.RegularExpressions;\r\n\r\nnamespace Progman\r\n{\r\n\tpublic class Program\r\n\t{\r\n\t\tpublic static void Main(string[] args)\r\n\t\t{\r\n\t\t\t// Your code goes here\r\n\t\t\tConsole.WriteLine(\"Hello, world!\");\r\n\t\t}\r\n\t}\r\n}` },
    { languageNumber: "4", label: "Java", boilerPlateCode: `// 'main' method must be in a class 'Progman'.\n// openjdk version '11.0.5'\n\nimport java.util.*;\nimport java.lang.*;\n\nclass Progman\n{\n\tpublic static void main(String args[])\n\t\t{\n\t\t\tSystem.out.println("Hello, World!");\n\t\t}\n}` },
    { languageNumber: "5", label: "Python", boilerPlateCode: `# Python 2.7.17\nprint "Hello, world!"` },
    { languageNumber: "6", label: "C (gcc)", boilerPlateCode: `// gcc 7.4.0\r\n\r\n#include <stdio.h>\r\n\r\nint main(void)\r\n{\r\n\tprintf(\"Hello, world!\\n\");\r\n\treturn 0;\r\n}` },
    { languageNumber: "7", label: "C++ (gcc)", boilerPlateCode: `// g++  7.4.0\r\n\r\n#include <iostream>\r\n\r\nint main()\r\n{\r\n\tstd::cout << \"Hello, world!\\n\";\r\n}` },
    { languageNumber: "8", label: "PHP", boilerPlateCode: `// php 7.2.24\r\n<?php \r\n\r\necho \"Hello, world! \"\r\n\r\n?>` },
    { languageNumber: "11", label: "Haskell", boilerPlateCode: `-- ghc 8.0.2\r\n\r\nmain = print $ \"Hello, world!\"` },
    { languageNumber: "12", label: "Ruby", boilerPlateCode: `# ruby 2.5.1 \r\n\r\nputs \"Hello, world!\"` },
    { languageNumber: "13", label: "Perl", boilerPlateCode: `# perl 5.26.1 \r\n\r\nprint \"Hello World\\n\";` },
    { languageNumber: "17", label: "Javascript", boilerPlateCode: `// nodejs v8.10.0\r\n\r\nconsole.log(\"Hello, World!\");` },
    { languageNumber: "60", label: "TypeScript", boilerPlateCode: `// nodejs v8.10.0\r\n\r\nconsole.log(\"Hello, World!\");` },
    { languageNumber: "20", label: "Golang", boilerPlateCode: `// go 1.10.4\r\n\r\npackage main  \r\nimport \"fmt\" \r\n\r\nfunc main() { \r\n\tfmt.Printf(\"hello, world\\n\") \r\n}` },
    { languageNumber: "21", label: "Scala", boilerPlateCode: `// 'Progman\' class is the entry point for your code.\r\n// Don\'t declare a package.\r\n// scala 2.13.1\r\n\r\nobject Progman extends App {\r\n\tprintln(\"Hello, World!\")\r\n }` },
    { languageNumber: "37", label: "Swift", boilerPlateCode: `// swift 5.1.5\r\n\r\nprint(\"Hello, world!\")` },
    { languageNumber: "38", label: "Bash", boilerPlateCode: `# !\/bin\/bash\r\n# GNU bash, version 4.4.20\r\n\r\necho \"Hello, world!\";\r\n` },
    { languageNumber: "43", label: "Kotlin", boilerPlateCode: `// Kotlin 1.1\r\n\r\nfun main(args: Array<String>) {\r\n\tprintln(\"Hello, world!\")\r\n}` },
];

const FONTSIZES = [
    { value: 12 },
    { value: 13 },
    { value: 14 },
    { value: 15 },
    { value: 16 },
    { value: 17 },
    { value: 18 },
    { value: 19 },
    { value: 20 },
    { value: 21 },
    { value: 22 },
    { value: 23 },
    { value: 24 },
];

const INDENTSIZES = [
    { value: 2 },
    { value: 4 },
];

const TABSIZES = [
    { value: 2 },
    { value: 4 },
];

export { LANGUAGES, FONTSIZES, INDENTSIZES, TABSIZES };