import { patchModule } from "../patch.js";
import dummy from "dummy";
import type { MethodWrapper } from "../types.js";

const logWrapper: MethodWrapper = (original, moduleName, methodName) => {
  console.log(`[${moduleName}][${methodName}] hooked`);
  return function(this: unknown, ...args: unknown[]) {
    console.log(`[${moduleName}][${methodName}] called with:`, args);
    const result = original.apply(this, args);
    console.log(`[${moduleName}][${methodName}] returned:`, result);
    return result;
  };
};

const hook = patchModule("dummy", logWrapper);

dummy.greet("world");
dummy.add(1, 2);

hook.unhook();