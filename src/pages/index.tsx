import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import {
  SignInOptions,
  SignInResponse,
  signIn,
  useSession,
} from "next-auth/react";
import Link from "next/link";
import Router from "next/router";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { SubmitHandler, useForm } from "react-hook-form";

const signInWrapper = async (payload: SignInOptions) => {
  const response = (await signIn("credentials", payload)) as SignInResponse;
  if (!response.ok) throw new Error("Unable to login");
  return response;
};

export default function Home() {
  const { register, handleSubmit } = useForm<{
    username: string;
    password: string;
  }>();
  const onSubmit: SubmitHandler<{
    username: string;
    password: string;
  }> = async (data) =>
    await toast.promise(
      signInWrapper({
        ...data,
        redirect: false,
      }),
      {
        loading: "Loading...",
        success: "Logged in successfully!",
        error: "Error!",
      }
    );
  const { status } = useSession();
  useEffect(() => {
    if (status === "authenticated") Router.push("/auth");
  }, [status]);
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center">
          <div className="rounded-full border border-white/5 bg-gray-800 p-2">
            <ShieldCheckIcon className="mx-auto h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6 text-white"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                {...register("username")}
                type="text"
                autoComplete="username"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-white"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                {...register("password")}
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-400">
          Not a member?{" "}
          <Link
            href="/signup"
            className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
