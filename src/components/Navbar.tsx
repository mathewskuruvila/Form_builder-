import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Logo from './Logo'
import ThemeSwitcher from "./ThemeSwitcher"
import { Link } from "react-router-dom"

type Props = {}

const Navbar = (props: Props) => {
    const handleOpen = () => {
    }
    return (
        <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
            <Logo />
            <div className="flex gap-4 items-center">
                <ThemeSwitcher/>
                <DropdownMenu>
                <DropdownMenuTrigger  className="focus-visible:outline-none">
                <Avatar onClick={handleOpen} className="cursor-pointer mr-5">
                    <AvatarImage  />
                    <AvatarFallback>FB</AvatarFallback>
                </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="mr-16 ">
                        <DropdownMenuLabel>My Name</DropdownMenuLabel>
                        <Link to={'/'}>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>demo</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem>Login</DropdownMenuItem>
                        <DropdownMenuItem>Register</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

            </div>
        </nav>
    )
}

export default Navbar