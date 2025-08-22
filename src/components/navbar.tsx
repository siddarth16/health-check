"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          HealthCheck
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-sm font-medium">
                Calculators
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem disabled>BMI</DropdownMenuItem>
              <DropdownMenuItem disabled>Calories</DropdownMenuItem>
              <DropdownMenuItem disabled>Macros</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
        </nav>
      </div>
    </header>
  );
}