import { QrCode } from "lucide-react";
import "./app.css";

export default function App() {
  return (
    <div className="flex flex-1 flex-col items-center w-full h-full">
      <div className="flex flex-1">fqwfw</div>
      <div className="flex p-2 flex-col items-center">
        <QrCode width={35} height={35} />
        <div className="text-xs mt-1">Scan QR</div>
      </div>
    </div>
  );
}
