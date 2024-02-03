import { load } from "cheerio";
import $ from "cash-dom";

const w = window as any;
export const extractWeb = async (raw_url: string) => {
  const url = new URL(raw_url);
  const res = await fetch(url);
  const _ = load(await res.text());


  const base_url = `${url.protocol}//${url.host}`;
  w.basehost = base_url;
  const extract_append = (container: string, child: string) => {
    _(container)
      .children(child)
      .map((idx, el) => {
        if (el.attribs.href) {
          el.attribs.href = `${base_url}${el.attribs.href}`;
        }

        if (el.attribs.src) {
          el.attribs.src = `${base_url}${el.attribs.src}`;
        }

        $(container).append(
          `<${child} ${Object.entries(el.attribs)
            .map(([key, val]) => {
              return `${key}="${val}"`;
            })
            .join(" ")} />`
        );
      });
  };
  $("#prasi_wrap_root").remove();
  extract_append("head", "link");
  extract_append("body", "script");
};
