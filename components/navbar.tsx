"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardPlus, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/demo" className="flex items-center gap-2">
            <ClipboardPlus className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold text-gray-800">
              MedAssist
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/demo/booking ">
              <Button variant="outline" className="cursor-pointer">
                Book Appointment
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="default" className="cursor-pointer">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {isOpen ? (
                <X className="w-6 h-6 cursor-pointer" />
              ) : (
                <Menu className="w-6 h-6 cursor-pointer" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <>
          <div className="md:hidden px-4 pb-4 flex flex-col gap-2 absolute left-0 right-0   bg-white shadow-sm">
            <Link href="/demo/booking" onClick={() => setIsOpen(false)}>
              <Button variant="outline" className="cursor-pointer w-full">
                Book Appointment
              </Button>
            </Link>
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <Button variant="default" className="w-full cursor-pointer">
                Login
              </Button>
            </Link>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
