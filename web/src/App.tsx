import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import $ from "cash-dom";
import { QrCode, StopCircle } from "lucide-react";

import { useEffect } from "react";
import { WebEntry, WebList, extractWeb } from "./utils/extract";
import { useLocal } from "./utils/use-local";

const w = window as any;
export default function App() {
  const local = useLocal({
    scanning: false,
    list: JSON.parse(localStorage.getItem("page-list") || `[]`) as WebList,
  });

  useEffect(() => {
    checkPermission().then(() => {});
    if (w.prasi_page_id) {
      const raw = localStorage.getItem(`page-${w.prasi_page_id.id}`);
      if (!raw) return;
      const ent = JSON.parse(raw) as WebEntry;
      if (ent) {
        extractWeb(ent);
      }
    }
  }, []);

  return (
    <div className="flex flex-1 flex-col items-center w-full h-full">
      <div className="flex flex-col max-w-[400px] min-w-[320px] flex-1">
        <div className="py-4">
          <div className="border-l-4 border-l-black pl-2">Prasi Wrapper</div>
        </div>
        <div className="flex flex-1 flex-col">
          {!local.scanning && (
            <>
              {local.list.length === 0 && (
                <div className="py-[20px] items-center self-stretch flex flex-col border-y mt-[40px]">
                  &mdash; List Empty &mdash;
                </div>
              )}
              {local.list.map((e, idx) => {
                const raw = localStorage.getItem(`page-${e.id}`);
                if (!raw) return null;
                const ent = JSON.parse(raw) as WebEntry;
                return (
                  <div
                    key={e.id}
                    className="flex justify-between items-stretch cursor-pointer select-none border my-1 "
                    onClick={() => {
                      extractWeb(ent);
                    }}
                  >
                    <div className="flex flex-col flex-1 p-2 ">
                      <div className="flex">Site: {e.site} </div>
                      <div className="flex">Page: {e.page}</div>
                    </div>
                    <div
                      className="p-2 flex items-center"
                      onClick={() => {
                        if (confirm("Remove this entry ?")) {
                          local.list.splice(idx, 1);
                          localStorage.setItem(
                            "page-list",
                            JSON.stringify(local.list)
                          );
                          local.render();
                        }
                      }}
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {local.scanning ? (
          <div
            className="flex p-2 flex-col items-center bg-white rounded-md"
            onClick={() => {
              local.scanning = false;
              local.render();
              stopScan();
            }}
          >
            <StopCircle width={35} height={35} />
            <div className="text-xs mt-1">Stop Scanning</div>
          </div>
        ) : (
          <div
            className="flex p-2 flex-col items-center"
            onClick={async () => {
              local.scanning = true;
              local.render();
              const res = await startScan();
              if (res.hasContent) {
                const content = JSON.parse(res.content) as WebEntry;

                extractWeb(content);
              } else {
                local.scanning = false;
                local.render();
              }
            }}
          >
            <QrCode width={35} height={35} />
            <div className="text-xs mt-1">Scan QR</div>
          </div>
        )}
      </div>
    </div>
  );
}

const stopScan = () => {
  $("html").removeClass("scanning-qr");
  $("body").removeClass("scanning-qr");
  BarcodeScanner.stopScan();
};

const startScan = async () => {
  $("html").addClass("scanning-qr");
  $("body").addClass("scanning-qr");
  return await BarcodeScanner.startScan();
};

const checkPermission = async () => {
  // check or request permission
  const status = await BarcodeScanner.checkPermission({ force: true });

  if (status.granted) {
    // the user granted permission
    return true;
  }

  return false;
};
