type bol = boolean;
type num = number;
type str = string;

type ENV = {
    isDev: bol;
    isProd: bol;
}

const env: Key & ENV;
const appDir: str;
function log(...message: any[]): void;
function joinAppDir(filePath: str): str;
function logCleanStack(error: Error): void;

type Globals = {
    env: ENV & { isDev: bol };
    appDir: str;
    log: typeof log;
    joinAppDir: typeof joinAppDir;
    logCleanStack: typeof logCleanStack;
}
