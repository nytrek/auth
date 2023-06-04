import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import {
  SignInOptions,
  SignInResponse,
  signIn,
  useSession,
} from "next-auth/react";
import Router from "next/router";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  age: number;
  address: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

function Modal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const { register, handleSubmit } = useForm<User>();

  const createUser = async function (user: User) {
    const { age, ...payload } = user;
    const response = await toast.promise(
      fetch(process.env.NEXT_PUBLIC_URL + "/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...payload,
          status: "Pending",
          age: parseInt(age as unknown as string),
        }),
      }),
      {
        loading: "Loading...",
        success: "User Created!",
        error: "Error!",
      }
    );
    const { error } = await response.json();
    if (error) throw new Error(error);
    setOpen(false);
  };

  const onSubmit: SubmitHandler<User> = (data) => createUser(data);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-xl transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between pb-4">
                        <h2 className="text-lg font-semibold leading-7 text-gray-900">
                          Create User
                        </h2>
                        <button type="button" onClick={() => setOpen(false)}>
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>

                      <hr className="-mx-6" />

                      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="firstName"
                            className="block text-sm leading-6 text-gray-700"
                          >
                            First name
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("firstName")}
                              id="firstName"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              placeholder="John"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="lastName"
                            className="block text-sm leading-6 text-gray-700"
                          >
                            Last name
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("lastName")}
                              id="lastName"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              placeholder="Doe"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="username"
                            className="block text-sm leading-6 text-gray-700"
                          >
                            Username
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("username")}
                              id="username"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              placeholder="johndoe97"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="age"
                            className="block text-sm leading-6 text-gray-700"
                          >
                            Age
                          </label>
                          <div className="mt-2">
                            <input
                              type="number"
                              {...register("age")}
                              id="age"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              placeholder="10"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="address"
                            className="block text-sm leading-6 text-gray-700"
                          >
                            Address
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              {...register("address")}
                              id="address"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              placeholder="Acme street 7"
                              required
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="password"
                            className="block text-sm leading-6 text-gray-700"
                          >
                            Password
                          </label>
                          <div className="mt-2">
                            <input
                              type="password"
                              {...register("password")}
                              id="password"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
                              placeholder="Acme123"
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:col-span-2">
                          <button
                            type="submit"
                            className="focus-visible:outline-bg-[#FCAF17] mt-6 inline-flex w-full justify-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const signInWrapper = async (payload: SignInOptions) => {
  const response = (await signIn("credentials", payload)) as SignInResponse;
  if (!response.ok) throw new Error("Unable to login");
  return response;
};

export default function Home() {
  const [open, setOpen] = useState(false);
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
  if (status === "loading" || status === "authenticated") return <></>;
  return (
    <>
      <Modal open={open} setOpen={setOpen} />
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
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="font-semibold leading-6 text-indigo-400 hover:text-indigo-300"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
