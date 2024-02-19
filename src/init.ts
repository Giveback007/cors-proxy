import { key } from "./_key";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import fetch, {
    Blob,
    blobFrom,
    blobFromSync,
    File,
    fileFrom,
    fileFromSync,
    FormData,
    Headers,
    Request,
    Response,
  } from 'node-fetch'



{
    if (!globalThis.fetch) {
        globalThis.fetch = fetch as any;
        globalThis.Headers = Headers as any;
        globalThis.Request = Request as any;
        globalThis.Response = Response as any;
    }

    const isDev = key.env === 'dev';
    const isProd = key.env === 'prod';
    if (!isDev && !isProd) throw new Error('Unhandled Mode');

    // set the serve Timezone to UTC
    process.env.TZ = 'UTC';

    const appDir = dirname(fileURLToPath(import.meta.url));
    const joinAppDir = (filePath: str) => join(appDir, filePath);

    const root = joinAppDir('../..');

    const globals: Globals = {
        env: { ...key, isDev, isProd },
        log: console.log,
        appDir,
        joinAppDir,
        logCleanStack: (error: Error) => {
            const { stack } = error;
            if (!stack) return;
        
            const lines = stack.split('\n');

            const cleanLines = lines.filter(line => line.includes(root) && !line.includes('/node_modules/'));
            log(cleanLines.join('\n'));
        },
    }

    Object.assign(globalThis, globals);

    process.on('uncaughtException', (err) => {
        console.error('An uncaughtException was found, the program will end.');
        console.error(err.stack);
        
        if (env.isDev) debugger;
        
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        try { logCleanStack(reason as any); } catch { }

        if (env.isDev) debugger;
        process.exit(1);
    });
}

