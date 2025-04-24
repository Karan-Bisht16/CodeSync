import axios from 'axios';
import prettier from 'prettier';
import pluginXml from '@prettier/plugin-xml';
import pluginRust from 'prettier-plugin-rust';
import pluginJava from 'prettier-plugin-java';
import pluginRuby from '@prettier/plugin-ruby';
import pluginKotlin from 'prettier-plugin-kotlin';
import * as pluginPhp from '@prettier/plugin-php';
// importing types
import type { Request, Response } from 'express';
// importing utils
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const executeCode = asyncHandler(async (req: Request, res: Response) => {
    console.log(req.body);
    const { languageChoice, program, input } = req.body;

    const encodedParams = new URLSearchParams();
    encodedParams.append('LanguageChoice', languageChoice);
    encodedParams.append('Program', program);
    encodedParams.append('Input', input);

    const options = {
        method: 'POST',
        url: 'https://code-compiler.p.rapidapi.com/v2',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': process.env.CODE_COMPILER_API_KEY,
            'X-RapidAPI-Host': 'code-compiler.p.rapidapi.com',
        },
        data: encodedParams,
    };
    try {
        const response = await axios.request(options);

        let result = response.data.Result;
        let error = false;
        if (result === null) {
            result = response.data.Errors;
            error = true;
        }
        return res.status(200)
            .json(new apiResponse({
                code: 200,
                data: { result, error },
                message: error ? 'An error occurred while executing the code' : 'Code execution completed successfully'
            }));
    } catch (error: unknown) {
        let message = 'Something went wrong, Please check your code and input.';
        if (
            axios.isAxiosError(error) &&
            error.response?.status === 504 &&
            error.response.statusText === 'Gateway Time-out'
        ) {
            message = 'Timeout exception. Check your code.';
        }
        return res.status(200)
            .json(new apiResponse({
                code: 504,
                data: { result: null, error: true },
                message
            }));
    }
});

const formatCode = asyncHandler(async (req: Request, res: Response) => {
    const { code, language } = req.body;

    const parserMap: Record<string, string> = {
        javascript: 'babel',
        typescript: 'typescript',
        json: 'json',
        php: 'php',
        java: 'java',
        python: 'python',
        xml: 'xml',
        html: 'html',
        css: 'css',
        ruby: 'ruby',
    };

    const parser = parserMap[language];
    if (!parser) throw new apiError({
        code: 500,
        message: 'No Prettier parser for this language',
    });

    // Do this in above if block
    // Save code to temp file
    // const tempFile = `/tmp/${uuid()}.txt`;
    // fs.writeFileSync(tempFile, code);

    // let dockerCommand = '';

    // if (language === 'cpp' || language === 'c') {
    //   dockerCommand = `docker run --rm -v ${tempFile}:/input.cpp formatter-cpp /input.cpp`;
    // }
    // Extend this for go, swift, etc.

    // const output = execSync(dockerCommand).toString();
    // fs.unlinkSync(tempFile); // clean up

    // return res.json({ formatted: output });

    const formatted = await prettier.format(code, {
        parser,
        plugins: [pluginPhp, pluginXml, pluginRuby, pluginJava, pluginKotlin, pluginRust],
    });

    return res.status(200)
        .json(new apiResponse({
            code: 200,
            data: formatted,
            message: 'Code formatted successfully'
        }));
});

export {
    executeCode,
    formatCode,
};