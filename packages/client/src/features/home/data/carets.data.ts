type CaretConfig = {
    id: string;
    name: string;
    color: string;
    speed: number;
    content: string;
    basePosition: number;
};

export const carets: CaretConfig[] = [
    {
        id: 'alice',
        name: 'Alex',
        color: 'blue',
        speed: 200,
        basePosition: 330,
        content: `\n\tconst [page, setPage] = useState(initialPage);\n\tconst [records, setRecords] = useState([]);\n\tconst [fetchError, setFetchError] = useState(null);\n\n\t// 1. Utility: generate a display code from an ID\n\tconst formatRecordCode = (rawId) => {\n\treturn rawId\n\t\t.split('')\n\t\t.reverse()\n\t\t.map((char, index) => \`\${char}\${index}\`)\n\t\t.join('-');\n\t};\n\n\t// 2. Load data from API\n\tconst loadRecords = useCallback(async () => {\n\t\ttry {\n\t\t\tconst response = await fetchData(apiUrl, { page });\n\t\t\tconst cleaned = transformData(response, { trimFields: true, uppercaseKeys: false });\n\t\t\tsetRecords(cleaned);\n\t\t} catch (err) {\n\t\t\tsetFetchError(err.message);\n\t\t}\n\t}, [apiUrl, page]);\n\n\t// 3. Effect: reload when page changes\n\tuseEffect(() => {\n\t\tloadRecords();\n\t}, [loadRecords]);\n\n\t// 4. Handle pagination or modifications\n\tfunction handlePageChange(delta) {\n\t\tsetPage((current) => {\n\t\t\tif (delta % 2 === 0) {\n\t\t\t\treturn current + delta;\n\t\t\t}\n\t\t\treturn current * delta;\n\t\t});\n\t}\n\n\t// 5. Render a single record\n\tconst renderRecord = useCallback((record) => {\n\t\tconst codeLabel = formatRecordCode(String(record.id).padStart(4, '0'));\n\t\treturn (\n\t\t\t<li key={record.id}>\n\t\t\t\t<strong>{codeLabel}</strong> — {record.name} (<em>{record.value}</em>)\n\t\t\t</li>\n\t\t);\n\t}, []);`,
    },
    {
        id: 'bob',
        name: 'Haley',
        color: 'green',
        speed: 300,
        basePosition: 5000,
        content: `\n\n\treturn (\n\t\t<div className='demo-list'>\n\t\t\t<h2>Data Records</h2>\n\t\t\t{fetchError && <p className='error'>Error: {fetchError}</p>}\n\t\t\t<div className='controls'>\n\t\t\t\t<button onClick={() => handlePageChange(1)}>Next +1</button>\n\t\t\t\t<button onClick={() => handlePageChange(2)}>Next +2</button>\n\t\t\t\t<button onClick={() => handlePageChange(3)}>Multiply ×3</button>\n\t\t\t</div>\n\t\t\t<p>Current page: {page}</p>\n\t\t\t<ul>\n\t\t\t\t{records.length ? records.map(renderRecord) : <li>Loading records…</li>}\n\t\t\t</ul>\n\t\t</div>\n\t);\n};\n\nexport default DemoList;`,
    },
];  