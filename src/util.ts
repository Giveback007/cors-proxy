export const time = {
    sec: (s: number) => s * 1_000,
    min: (m: number) => m * 60_000,
    hrs: (h: number) => h * 3_600_000,
    day: (d: number) => d * 86_400_000,
    wks: (w: number) => w * 604_800_000,
}

/**
 * Returns ms time for time ago from Date.now()
 * @param ms ms to subtract from Date.now()
 * @returns Date.now() - ms
 */
export const ago = (ms: number) => Date.now() - ms;

export function recordById<
    T extends { [k: string]: any },
    ID extends keyof T
>(arr: T[], idKey: ID) {
    const obj: { [k: string]: T } = {};
    arr.forEach(x => obj[x[idKey]] = x);
    
    return obj;
}

export const wait = (ms: number) =>
    new Promise(resolve => setTimeout(resolve, ms));

export const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1) + min);

/** An improved version of native `typeof` */
export function type(val: any): JsType {
    if (val === null)               return 'null';
    if (Array.isArray(val))         return 'array';
    if (typeof val === 'object')    return 'object';
    if (val !== val)                return 'NaN';

    return typeof val;
}

/**
 * The function will test if the type of the first
 * argument equals testType. Argument testType is a string
 * representing a javascript type.
 *
 * @param val value to be tested
 * @param testType to check if typeof val === testType
 * @example
 * ```js
 * isType([], 'array') //=> true
 * isType(null, 'undefined') //=> false
 * ```
 */
export const isType = <T extends JsType> (
    val: any, testType: T
  ): val is JsTypeFind<T> => type(val) === testType;
  
/** any of the values in the first "example" return `true`
 * @example
 * ```js
 * nullOrEmpty(null | undefined | '' | [ ] | { }) //=> true
 * nullOrEmpty([1, 2] | { key: 'value' } | true) //=> false
 * ```
 */
export function nullOrEmpty(x: any): boolean {
    // null || undefined
    if (nonValue(x)) return true;

    // (string || array).length === 0
    if (isType(x, 'string') || isType(x, 'array')) return !x.length;

    // object // { key: 'val' } => false, { } => true
    if (isType(x, 'object')) return !Object.values(x).length;

    return false;
}

/** val `is` (null || undefined) */
export const nonValue = (val: any): val is (null | undefined) =>
  val === null || val === undefined;