"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

// ──────────────────────────────────────────────────────────────────────────
const LoginPage = () => {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const [res, setRes] = useState(null);

  useEffect(() => {
    const channel = new BroadcastChannel("EMAIL_VERIFICATION");

    channel.onmessage = (event) => {
      if (event.data.type === "EMAIL_VERIFICATION_SUCCESS") {
        router.replace("/");
      }
    };

    return () => {
      channel.close();
    };
  }, [router]);

  const onSubmit = async (data) => {
    try {
      const res = await api.post("auth/login", data);
      setRes(res.data);
      toast.success(`Login Success!`);
      router.replace("/");
    } catch (error) {
      console.error(error.response);
      toast.error(error.response?.data?.error ?? error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        {/* Logo / App Name */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">💬 ChatApp</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Connect with anyone, anywhere
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials below to sign in
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>

          <CardFooter className="justify-center pt-0">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link
                href="/signup"
                className="text-primary font-medium hover:underline"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
