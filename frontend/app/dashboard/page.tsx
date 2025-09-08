"use client";

import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import { LinkButton } from "@/components/buttons/LinkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL, HOOKS_URL } from "../config";

interface Zap {
  id: string;
  triggerId: string;
  userId: number;
  actions: {
    id: string;
    zapId: string;
    actionId: string;
    sortingOrder: number;
    type: {
      id: string;
      name: string;
      image: string;
    };
  }[];
  trigger: {
    id: string;
    zapId: string;
    triggerId: string;
    type: {
      id: string;
      name: string;
      image: string;
    };
  };
}

function useZaps() {
  const [loading, setLoading] = useState(true);
  const [zaps, setZaps] = useState<Zap[]>([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/zap`, {
        headers: {
          Authorization: localStorage.getItem("token") || "",
        },
      })
      .then((res) => {
        setZaps([...res.data.zaps].reverse()); // Safer: avoid mutating original array
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return { loading, zaps };
}

export default function ZapListPage() {
  const { loading, zaps } = useZaps();
  const router = useRouter();

  return (
    <div>
      <Appbar />

      <div className="flex justify-center pt-8">
        <div className="max-w-screen-lg w-full">
          <div className="flex justify-between items-center pr-8">
            <h1 className="text-2xl font-bold">My Zaps</h1>
            <DarkButton onClick={() => router.push("/zap/create")}>
              Create
            </DarkButton>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-8">Loading...</div>
      ) : (
        <div className="flex justify-center mt-8">
          <ZapTable zaps={zaps} />
        </div>
      )}
    </div>
  );
}

function ZapTable({ zaps }: { zaps: Zap[] }) {
  const router = useRouter();

  return (
    <div className="p-8 max-w-screen-lg w-full bg-white shadow rounded">
      <div className="flex font-semibold border-b pb-2">
        <div className="flex-1">Name</div>
        <div className="flex-1">ID</div>
        <div className="flex-1">Created At</div>
        <div className="flex-1">Webhook URL</div>
        <div className="flex-1">Go</div>
      </div>

      {zaps.map((z) => (
        <div key={z.id} className="flex items-center border-b py-4">
          <div className="flex-1 flex items-center gap-2">
            {z.trigger?.type?.image && (
              <img
                src={z.trigger.type.image}
                alt="Trigger"
                className="w-[30px] h-[30px]"
              />
            )}
            {z.actions?.map((a) => (
              <img
                key={a.id}
                src={a.type.image}
                alt={a.type.name}
                className="w-[30px] h-[30px]"
              />
            ))}
          </div>

          <div className="flex-1 break-all">{z.id}</div>
          <div className="flex-1">3 Aug 2025</div>
          <div className="flex-1 break-all">
            {`${HOOKS_URL}/hooks/catch/1/${z.id}`}
          </div>

          <div className="flex-1">
            <LinkButton onClick={() => router.push("/zap/" + z.id)}>
              Go
            </LinkButton>
          </div>
        </div>
      ))}
    </div>
  );
}
