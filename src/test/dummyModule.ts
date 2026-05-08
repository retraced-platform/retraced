import { patchModule } from "../patch";
import dummy from "dummy";

const hook = patchModule("dummy", (original, moduleName, methodName) => {
  return function (this: unknown, ...args: unknown[]) {
    console.log(`[${moduleName}][${methodName}] called with:`, args);
    const result = original.apply(this, args);
    console.log(`[${moduleName}][${methodName}] returned:`, result);
    return result;
  };
});

dummy.greet("world");
dummy.add(1, 2);

hook.unhook();