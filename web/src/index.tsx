import { createRoot } from "react-dom/client";

import App from "./App";

const w = window as any;
if (!!w.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  w.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
}

const root = createRoot(document.getElementById("prasi_wrap_root")!);

root.render(<App />);
