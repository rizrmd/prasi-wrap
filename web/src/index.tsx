import { createRoot } from "react-dom/client";
import $ from "cash-dom";
import App from "./App";
import "./app.css";
import { conf } from "./utils/conf";

const w = window as any;
if (!!w.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
  w.__REACT_DEVTOOLS_GLOBAL_HOOK__.isDisabled = true;
}

$("#root").hide();

const root = createRoot(document.getElementById("prasi_wrap_root")!);
conf.root = root;

root.render(<App />);
