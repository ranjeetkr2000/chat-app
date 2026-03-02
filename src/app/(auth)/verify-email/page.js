"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(token ? STATUS.LOADING : STATUS.ERROR);
  const [message, setMessage] = useState(
    token ? "" : "No verification token found. Please check your email link.",
  );

  useEffect(() => {
    if (!token) return;
    const channel = new BroadcastChannel("EMAIL_VERIFICATION");
    const verifyEmail = async () => {
      try {
        const res = await axios.get(`/api/auth/verify-email?token=${token}`);
        setStatus(STATUS.SUCCESS);
        setMessage(
          res.data.message || "Your email has been verified successfully!",
        );
        //check if token exists in cookies and user data exists.
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.replace("/");
        }, 1000);
        channel.postMessage({ type: "EMAIL_VERIFICATION_SUCCESS" });
      } catch (error) {
        setStatus(STATUS.ERROR);
        setMessage(
          error.response?.data?.error ||
            "Invalid or expired verification link. Please request a new one.",
        );
      }
    };

    verifyEmail();

    return () => {
      channel.close();
    };
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">💬 ChatApp</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Connect with anyone, anywhere
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-10 pb-10 flex flex-col items-center text-center gap-4">
            {/* ── Loading State ───────────────────────────── */}
            {status === STATUS.LOADING && (
              <>
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <h2 className="text-xl font-semibold mt-2">
                  Verifying your email...
                </h2>
                <p className="text-muted-foreground text-sm">
                  Please wait while we verify your email address.
                </p>
              </>
            )}

            {/* ── Success State ───────────────────────────── */}
            {status === STATUS.SUCCESS && (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-green-700">
                  Email Verified!
                </h2>
                <p className="text-muted-foreground text-sm">{message}</p>
                <p className="text-muted-foreground text-xs">
                  Redirecting you to login in 3 seconds...
                </p>
                <Button className="w-full mt-2" asChild>
                  <Link href="/login">Go to Login now</Link>
                </Button>
              </>
            )}

            {/* ── Error State ─────────────────────────────── */}
            {status === STATUS.ERROR && (
              <>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-700">
                  Verification Failed
                </h2>
                <p className="text-muted-foreground text-sm">{message}</p>
                <div className="flex flex-col w-full gap-2 mt-2">
                  <Button variant="outline" asChild>
                    <Link href="/resend-verification">
                      Resend Verification Email
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/login">Back to Login</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
