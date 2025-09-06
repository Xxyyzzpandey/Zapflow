"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton";
import { PrimaryButton } from "./buttons/PrimaryButton";
import { Menu, X } from "lucide-react";

export const Appbar = () => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login state on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleSignout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo / Brand */}
        <div
          className="text-2xl font-extrabold tracking-tight text-blue-600 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Zapier
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <LinkButton onClick={() => router.push("/guidetouse")}>Guide</LinkButton>
          <LinkButton onClick={() => router.push("/zap/create")}>+Zaps</LinkButton>

          {!isLoggedIn ? (
            <>
              <LinkButton onClick={() => router.push("/login")}>Login</LinkButton>
              <PrimaryButton onClick={() => router.push("/signup")}>
                Signup
              </PrimaryButton>
            </>
          ) : (
            <>
            <LinkButton onClick={() => router.push("/dashboard")}>dashboard</LinkButton>
            <PrimaryButton onClick={handleSignout}>Signout</PrimaryButton>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center text-gray-600 hover:text-blue-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden flex flex-col space-y-4 px-6 pb-6">
          <LinkButton
            onClick={() => {
              setMobileOpen(false);
              router.push("/guidetouse");
            }}
          >
            Guide
          </LinkButton>
          
          <LinkButton
            onClick={() => {
              setMobileOpen(false);
              router.push("/zap/create");
            }}
          >
            +Zaps
          </LinkButton>

          {!isLoggedIn ? (
            <>
              <LinkButton
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/login");
                }}
              >
                Login
              </LinkButton>
              <PrimaryButton
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/signup");
                }}
              >
                Signup
              </PrimaryButton>
            </>
          ) : (
            <><LinkButton
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/dashboard");
                }}
              >
                dashboard
              </LinkButton>
            <PrimaryButton
              onClick={() => {
                setMobileOpen(false);
                handleSignout();
              }}
            >
              Signout
            </PrimaryButton>
          </>)}
        </div>
      )}
    </nav>
  );
};
