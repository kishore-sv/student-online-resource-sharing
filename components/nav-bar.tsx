import { IconBook } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";

export default function NavBar() {
    return (
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <IconBook className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-semibold text-lg">StudyHub</span>
                    </div>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#" className="text-sm hover:text-primary transition-colors">
                            Features
                        </Link>
                        <Link href="#" className="text-sm hover:text-primary transition-colors">
                            About
                        </Link>
                        <Link href="#" className="text-sm hover:text-primary transition-colors">
                            Pricing
                        </Link>
                    </div>

                    {/* CTA Buttons */}
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
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}