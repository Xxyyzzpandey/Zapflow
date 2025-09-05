"use client";
import { Appbar } from "@/components/Appbar";
import { CheckFeature } from "@/components/checkFeature";
import { Input } from "@/components/input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useState } from "react";
import { BACKEND_URL } from "../config";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        username: email,
        password,
        name,
      });

      setLoading(false);
      router.push("/login");
    } catch (err: any) {
      setLoading(false);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="flex pt-8 max-w-4xl">
          {/* Left side text */}
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

          {/* Signup form */}
          <div className="flex-1 pt-6 pb-6 mt-12 px-6 border rounded shadow-sm">
            <Input
              label={"Name"}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Your name"
            />
            <Input
              label={"Email"}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Your Email"
            />
            <Input
              label={"Password"}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
            />

            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}

            <div className="pt-4">
              <PrimaryButton
                onClick={handleSignup}
                size="big"
              >
                {loading ? "Signing up..." : "Get started free"}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
