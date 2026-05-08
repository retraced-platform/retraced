// import {
//   InstrumentationBase,
//   InstrumentationNodeModuleDefinition
// } from "@opentelemetry/instrumentation";
// import { OpenAIConfig } from "./types";
// import { VERSION } from "@opentelemetry/instrumentation/build/src/version";
//
//
// class RetracedOpenAIInstrumentation extends InstrumentationBase {
//   constructor(config?: OpenAIConfig) {
//     super('@retraced/openai', VERSION, config ?? {});
//   }
//
//   init(): InstrumentationNodeModuleDefinition {
//     return new InstrumentationNodeModuleDefinition(
//       'openai',
//       ['*'],
//       (moduleExports) => this._onPatch(moduleExports),
//       (moduleExports) => this._onUnpatch(moduleExports),
//     );
//   }
// }