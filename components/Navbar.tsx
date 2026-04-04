import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import UserMenu from "./UserMenu"
import { IconBook } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";
import { ArrowRight } from "lucide-react";

export default async function Navbar() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <IconBook className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-lg">StudyHub</span>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                        <Link href="/features" className="text-sm font-medium hover:text-primary transition-colors">
                            Features
                        </Link>
                        <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                            Pricing
                        </Link>
                    </div>

                    {/* session-based UI */}
                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button size="lg" className="bg-primary hover:bg-primary/90 cursor-pointer">
                                        Dashboard
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                                <UserMenu user={{
                                    name: session.user.name,
                                    email: session.user.email,
                                    image: session.user.image
                                }} />

                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="cursor-pointer">
                                        Sign In
                                    </Button>
                                </Link>
                                <Link href="/signup">
                                    <Button size="sm" className="bg-primary hover:bg-primary/90 cursor-pointer">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        )}
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}
