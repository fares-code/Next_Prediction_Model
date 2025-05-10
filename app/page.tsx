// import Image from "next/image";

import HealthForm from "@/components/ui/HealtForm";

export default function Home() {
  return (
    <div className="w-full max-w-[700px] px-4 mx-auto">
      <div className="mt-5">
        <h1 className="text-xl md:text-2xl font-bold text-center">Health Survey to Check Your Sugar Level</h1>
        <HealthForm/>
      </div>
    </div>
  );
}
