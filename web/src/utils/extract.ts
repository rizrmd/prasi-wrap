import $ from "cash-dom";
import { load } from "cheerio";
import { conf } from "./conf";

const w = window as any;
export type WebEntry = {
  site: { name: string; id: string };
  page: { name: string; id: string; url: string };
  html: string;
};

export type WebList = { page: string; site: string; id: string }[];

export const extractWeb = async (ent: WebEntry) => {
  const raw_url = `https://prasi.avolut.com/vi/${ent.site.id}/${ent.page.id}`;

  const page_list: WebList = JSON.parse(
    localStorage.getItem("page-list") || "[]"
  );
  const unique_list: any = {};
  for (const item of page_list) {
    unique_list[item.id] = item;
  }

  unique_list[ent.page.id] = {
    page: ent.page.name,
    site: ent.site.name,
    id: ent.page.id,
  };
  localStorage.setItem("page-list", JSON.stringify(Object.values(unique_list)));

  const existing = localStorage.getItem(`page-${ent.page.id}`);
  if (existing) {
    ent.html = JSON.parse(existing).html;
  }
  localStorage.setItem(`page-${ent.page.id}`, JSON.stringify(ent));

  const reloadHtml = async () => {
    const res = await fetch(`${conf.base}/_proxy`, {
      method: "POST",
      body: JSON.stringify([{ url: raw_url }]),
      headers: { "content-type": "application/json" },
    });
    const html = await res.text();
    ent.html = html;

    localStorage.setItem(`page-${ent.page.id}`, JSON.stringify(ent));
  };

  const url = new URL(raw_url);
  if (location.pathname !== url.pathname) {
    w.prasi_page_id = ent.page.id;

    history.pushState({}, "", url.pathname);

    setTimeout(() => {
      extractWeb(ent);
    }, 100);
    return;
  }

  conf.root?.unmount();
  $("#prasi_wrap_root").remove();
  $("#root").show();

  if (!ent.html) {
    await reloadHtml();
  } else {
    reloadHtml();
  }

  const _ = load(ent.html);

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
  extract_append("head", "link");
  extract_append("body", "script");
};
