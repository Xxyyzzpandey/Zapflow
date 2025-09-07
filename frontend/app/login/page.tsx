"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/checkFeature";
import { Input } from "@/components/input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
        username: email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="flex pt-8 max-w-4xl w-full">
          {/* Left side features */}
          <div className="flex-1 pt-20 px-4">
            <div className="font-semibold text-3xl pb-4">
              Join millions worldwide who automate their work using Zapier.
            </div>
            <div className="pb-6 pt-4">
              <CheckFeature label={"Easy setup, no coding required"} />
            </div>
            <div className="pb-6">
              <CheckFeature label={"Free forever for core features"} />
            </div>
            <CheckFeature label={"14-day trial of premium features & apps"} />
          </div>

          {/* Right side login */}
          <div className="flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
            <Input
              onChange={(e) => setEmail(e.target.value)}
              label={"Email"}
              type="text"
              placeholder="Your Email"
            />
            <Input
              onChange={(e) => setPassword(e.target.value)}
              label={"Password"}
              type="password"
              placeholder="Password"
            />

            {/* Error message */}
            {error && (
              <div className="text-red-600 text-sm mt-2">{error}</div>
            )}

            <div className="pt-4">
              <PrimaryButton
                onClick={handleLogin}
                size="big"
              >
                {loading ? "Logging in..." : "Login"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
