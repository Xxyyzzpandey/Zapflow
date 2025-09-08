"use client";

import { BACKEND_URL } from "@/app/config";
import { Appbar } from "@/components/Appbar";
import { ZapCell } from "@/components/ZapCell";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Modal } from "@/app/Modals/models";
import { useAvailableActionsAndTriggers } from "@/app/custonHook/availableactionandtrigger";

export default function ZapBuilderPage() {
  const router = useRouter();
  const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(false); // null = loading
  const [selectedTrigger, setSelectedTrigger] = useState<{ id: string; name: string }>();
  const [selectedActions, setSelectedActions] = useState<
    { index: number; availableActionId: string; availableActionName: string; metadata: any }[]
  >([]);
  const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);
  const [publishing,setPublishing]=useState(false);
  const [triggerMetadata, setTriggerMetadata] = useState<any>({});


  // ✅ Check login on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      return;
    }
  }, []);

  

  if (!isAuthenticated) {
    return (<>
    <Appbar/>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">You are not logged in</h1>
        <PrimaryButton onClick={() => router.push("/login")}>Login</PrimaryButton>
        <PrimaryButton onClick={() => router.push("/signup")}>Sign Up</PrimaryButton>
      </div>
    </>);
  }

  // ✅ Actual Zap builder page
  return (
    <div>
      <Appbar />
      <div className="flex justify-end bg-slate-200 p-4">
        <PrimaryButton
  onClick={async () => {
    if (!selectedTrigger?.id) {
      return;
    }

    setPublishing(true);

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/zap`,
        {
          availableTriggerId: selectedTrigger.id,
          triggerMetadata,
          actions: selectedActions.map((a) => ({
            availableActionId: a.availableActionId,
            actionMetadata: a.metadata,
          })),
        },
        {
          headers: {
            Authorization: localStorage.getItem("token") || "",
          },
        }
      );

      router.push("/dashboard");
    } catch (error) {
      console.error("Failed to publish zap:", error);
      // Optionally show a user-friendly error notification here
    } finally {
      setPublishing(false);
    }
  }}
>
  {publishing ? "publishing..." : "publish"}
</PrimaryButton>
      </div>

      <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
        <div className="flex justify-center w-full">
          <ZapCell
            onClick={() => setSelectedModalIndex(1)}
            name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"}
            index={1}
          />
        </div>

        <div className="w-full pt-2 pb-2">
          {selectedActions.map((action, index) => (
            <div key={index} className="pt-2 flex justify-center">
              <ZapCell
                onClick={() => setSelectedModalIndex(action.index)}
                name={action.availableActionName ? action.availableActionName : "Action"}
                index={action.index}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <PrimaryButton
            onClick={() =>
              setSelectedActions((a) => [
                ...a,
                { index: a.length + 2, availableActionId: "", availableActionName: "", metadata: {} },
              ])
            }
          >
            <div className="text-2xl">+</div>
          </PrimaryButton>
        </div>
      </div>

      {selectedModalIndex && (
        <Modal
          availableItems={selectedModalIndex === 1 ? availableTriggers : availableActions}
          onSelect={(props: null | { name: string; id: string; metadata: any }) => {
            if (props === null) {
              setSelectedModalIndex(null);
              return;
            }
            if (selectedModalIndex === 1) {
              setSelectedTrigger({ id: props.id, name: props.name });
              setTriggerMetadata(props.metadata || {});
            } else {
              setSelectedActions((a) => {
                let newActions = [...a];
                newActions[selectedModalIndex - 2] = {
                  index: selectedModalIndex,
                  availableActionId: props.id,
                  availableActionName: props.name,
                  metadata: props.metadata,
                };
                return newActions;
              });
            }
            setSelectedModalIndex(null);
          }}
          index={selectedModalIndex}
        />
      )}
    </div>
  );
}
