import { Hook } from 'require-in-the-middle';
import type { AnyFn, MethodWrapper } from './types';

declare const require: {
  cache: Record<string, { exports: Record<string, unknown> } | undefined>;
  resolve(id: string): string;
};

function applyWrapper(
  exported: Record<string, unknown>,
  moduleName: string,
  wrapper: MethodWrapper,
) {
  for (const key of Object.keys(exported)) {
    if (typeof exported[key] === 'function') {
      const original = exported[key] as AnyFn;
      exported[key] = wrapper(original, moduleName, key);
    }
  }
}

export function patchModule(moduleName: string, wrapper: MethodWrapper): Hook {
  try {
    const filename = require.resolve(moduleName);
    const mod = require.cache[filename];
    if (mod?.exports) {
      applyWrapper(mod.exports, moduleName, wrapper);
    }
  } catch {
    // not yet in cache — ritm Hook will catch it on first require
  }

  return new Hook([moduleName], (exported, name) => {
    applyWrapper(exported as Record<string, unknown>, name, wrapper);
    return exported;
  });
}