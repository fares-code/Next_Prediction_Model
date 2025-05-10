import { ThemeToggle } from "@/components/ui/themes"
import Image from "next/image"

const Header = () => {
  return (
    <header className="w-full p-3 md:p-4 shadow-md flex justify-between items-center">
      <Image src='/machine-learning.png' alt='logo' width={60} height={60} className="w-8 h-8 md:w-10 md:h-10 cursor-pointer"/>
      <h2 className="text-lg md:text-2xl font-bold">Computation Project</h2>
      <ThemeToggle/>
    </header>
  )
}

export default Header
