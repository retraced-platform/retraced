import { Hook as RequireHook } from 'require-in-the-middle';
import { createAddHookMessageChannel, Hook as ImportHook } from 'import-in-the-middle';
import type { AnyFn, MethodWrapper } from './types.js';
import { register, createRequire } from 'module';

const require = createRequire(import.meta.url);

// Register the ESM loader hook once at module init so it is in place
// before any subsequent dynamic import() calls.
const { registerOptions } = createAddHookMessageChannel();
register('import-in-the-middle/hook.mjs', import.meta.url, registerOptions);

export interface PatchHandle {
  unhook(): void;
}

const applyWrapper = (
  exported: Record<string, unknown>,
  moduleName: string,
  wrapper: MethodWrapper,
) => {
  for (const key of Object.keys(exported)) {
    if (typeof exported[key] === 'function') {
      const original = exported[key] as AnyFn;
      exported[key] = wrapper(original, moduleName, key);
    }
  }
};

export const patchModule = (moduleName: string, wrapper: MethodWrapper): PatchHandle => {
  // Patches already loaded CJS modules. i.e., Static imports
  try {
    const filename = require.resolve(moduleName);
    const mod = require.cache[filename];
    if (mod?.exports) {
      applyWrapper(mod.exports, moduleName, wrapper);
    }
  } catch {
    // not in require.cache
  }

  // Intercept future CJS require() calls
  const requireHook = new RequireHook([moduleName], (exported, name) => {
    applyWrapper(exported as Record<string, unknown>, name, wrapper);
    return exported;
  });

  // Intercept future ESM import() calls
  const importHook = new ImportHook([moduleName], (exported, name) => {
    applyWrapper(exported as Record<string, unknown>, name, wrapper);
    return exported;
  });

  return {
    unhook() {
      requireHook.unhook();
      importHook.unhook();
    },
  };
};