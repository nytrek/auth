import clsx from "clsx";
import { signOut, useSession } from "next-auth/react";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-hot-toast";

//https://github.com/vercel/next.js/discussions/26168#discussioncomment-1863742
function BlurImage(props: ImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="relative mx-auto h-16 w-16">
      <Image
        {...props}
        alt={props.alt}
        className={clsx(
          props.className,
          "h-8 w-8 rounded-full bg-gray-800 duration-700 ease-in-out",
          isLoading
            ? "scale-110 blur-sm grayscale"
            : "scale-100 blur-0 grayscale-0"
        )}
        fill
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
}

export default function Auth() {
  //https://medium.com/@romeobazil/share-auth-session-between-nextjs-multi-zones-apps-using-nextauth-js-5bab51bb7e31
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => router.push("/"),
  });
  if (status === "loading") {
    return <span>Loading...</span>;
  }
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <BlurImage
          src={
            "https://api.dicebear.com/6.x/avataaars/svg?seed=" + session.user.id
          }
          alt="avatar"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Authentication successful
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <Link
            href={process.env.NEXT_PUBLIC_CHAT_URL!}
            className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            Chat
          </Link>
          <button
            type="button"
            onClick={async () =>
              await toast.promise(
                signOut({
                  redirect: false,
                }),
                {
                  loading: "Loading...",
                  success: "Logged out successfully!",
                  error: "Error!",
                }
              )
            }
            className="flex w-full justify-center rounded-md border border-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
