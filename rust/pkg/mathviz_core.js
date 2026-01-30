/* @ts-self-types="./mathviz_core.d.ts" */

/**
 * Solve the damped pendulum.
 *
 * Returns a flat array of [θ0, ω0, θ1, ω1, ...] values.
 * @param {number} gamma
 * @param {number} omega0
 * @param {number} theta0
 * @param {number} omega_init
 * @param {number} dt
 * @param {number} steps
 * @returns {Float64Array}
 */
export function solve_damped_pendulum(gamma, omega0, theta0, omega_init, dt, steps) {
    const ret = wasm.solve_damped_pendulum(gamma, omega0, theta0, omega_init, dt, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * Solve the Lorenz system.
 *
 * Returns a flat array of [x0, y0, z0, x1, y1, z1, ...] values.
 * @param {number} sigma
 * @param {number} rho
 * @param {number} beta
 * @param {number} x0
 * @param {number} y0
 * @param {number} z0
 * @param {number} dt
 * @param {number} steps
 * @returns {Float64Array}
 */
export function solve_lorenz(sigma, rho, beta, x0, y0, z0, dt, steps) {
    const ret = wasm.solve_lorenz(sigma, rho, beta, x0, y0, z0, dt, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * Solve the Rössler system.
 *
 * Returns a flat array of [x0, y0, z0, x1, y1, z1, ...] values.
 * @param {number} a
 * @param {number} b
 * @param {number} c
 * @param {number} x0
 * @param {number} y0
 * @param {number} z0
 * @param {number} dt
 * @param {number} steps
 * @returns {Float64Array}
 */
export function solve_rossler(a, b, c, x0, y0, z0, dt, steps) {
    const ret = wasm.solve_rossler(a, b, c, x0, y0, z0, dt, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * Solve the Van der Pol oscillator.
 *
 * Returns a flat array of [x0, y0, x1, y1, ...] values.
 * For 3D visualization, z is set to 0.
 * @param {number} mu
 * @param {number} x0
 * @param {number} y0
 * @param {number} dt
 * @param {number} steps
 * @returns {Float64Array}
 */
export function solve_van_der_pol(mu, x0, y0, dt, steps) {
    const ret = wasm.solve_van_der_pol(mu, x0, y0, dt, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./mathviz_core_bg.js": import0,
    };
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

let wasmModule, wasm;
function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    wasmModule = module;
    cachedFloat64ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('mathviz_core_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
