
import { usePathname, useRouter } from "next/navigation";


export default function Sidebar() {

  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen border-r border-[#1f1f23] p-6">

      <h1 className="text-lg font-semibold mb-10">
        Resume AI
      </h1>

      <div className="space-y-2 text-sm">
        <div className={`p-2 cursor-pointer rounded-lg hover:bg-[#1a1a1c] ${pathname == '/dashboard' ? 'bg-[#1a1a1c]' : '' }`} onClick={() => router.push("/dashboard")} >Dashboard</div>
        {/* <div className={`p-2 rounded-lg hover:bg-[#1a1a1c] ${pathname == '/dashboard' ? 'bg-[#1a1a1c]' : '' }`}>Analyze</div> */}
        <div className={`p-2 cursor-pointer rounded-lg hover:bg-[#1a1a1c] ${pathname == '/history' ? 'bg-[#1a1a1c]' : '' }`}   onClick={() => router.push("/history")}
>History</div>
      </div>
    </div>
  );
}