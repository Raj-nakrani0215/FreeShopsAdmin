/// <reference types="react-scripts" />
// custom.d.ts or env.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_BASE_URL: string;
    }
  }
  