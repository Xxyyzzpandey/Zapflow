"use client";
import { Appbar } from "@/components/Appbar";
import { BACKEND_URL } from "@/app/config";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Zap {
  id: string;
  trigger: {
    id: string;
    type: { name: string; image?: string };
    metadata: Record<string, any>;
  };
  actions: {
    id: string;
    type: { name: string; image?: string };
    metadata: Record<string, any>;
  }[];
}

export default function ZapDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [zap, setZap] = useState<Zap | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [editedMetadata, setEditedMetadata] = useState<string>("");
  const [deletingActionId, setDeletingActionId] = useState<string | null>(null);

  useEffect(() => {
    fetchZap();
  }, [id]);

  const fetchZap = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/zap/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });
      setZap(res.data.zap);
    } catch (err) {
      console.error("Failed to fetch zap:", err);
      setZap(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAction = async (actionId: string) => {
  try {
    setDeletingActionId(actionId);

    // 1️⃣ Delete the action
    await axios.delete(`${BACKEND_URL}/api/v1/zap/action/${actionId}`, {
      headers: { Authorization: localStorage.getItem("token") || "" },
    });

    // 2️⃣ Refetch the zap after deletion
    try {
      const res = await axios.get(`${BACKEND_URL}/api/v1/zap/${id}`, {
        headers: { Authorization: localStorage.getItem("token") || "" },
      });

      if (res.data.zap) {
        setZap(res.data.zap);
      } else {
        router.push("/dashboard");
      }
    } catch (fetchErr:any) {
      // Handle 404 or other errors gracefully
      if (fetchErr.response?.status === 404) {
        // Zap no longer exists → redirect
        router.push("/dashboard");
      } else {
        console.error("Failed to fetch zap after action deletion:", fetchErr);
        alert("Something went wrong. Please refresh the page.");
      }
    }
  } catch (err) {
    console.error("Failed to delete action:", err);
    alert("Failed to delete action. Please try again.");
  } finally {
    setDeletingActionId(null);
  }
};



  const handleEditAction = (actionId: string, metadata: Record<string, any>) => {
    setEditingActionId(actionId);
    setEditedMetadata(JSON.stringify(metadata, null, 2));
  };

  const handleSaveAction = async (actionId: string) => {
    try {
      const parsedMetadata = JSON.parse(editedMetadata);

      await axios.put(
        `${BACKEND_URL}/api/v1/zap/action/${actionId}`,
        { metadata: parsedMetadata },
        { headers: { Authorization: localStorage.getItem("token") || "" } }
      );

      setEditingActionId(null);
      fetchZap();
    } catch (err) {
      console.error("Failed to save action:", err);
    }
  };

  return (
    <>
      <Appbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">⚡ Zap Details</h1>
        <p className="mb-8 text-gray-600 text-lg">
          Zap ID: <span className="font-mono">{id}</span>
        </p>

        {loading ? (
          <p className="text-gray-500 text-lg">⏳ Loading...</p>
        ) : zap ? (
          <div className="space-y-8">
            {/* Trigger Card */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-md border border-blue-100">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-blue-700">
                {zap.trigger?.type?.image && (
                  <img
                    src={zap.trigger.type.image}
                    alt={zap.trigger.type.name}
                    className="w-8 h-8 rounded-md"
                  />
                )}
                Trigger: {zap.trigger?.type?.name || "No trigger configured"}
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-200">
                <pre className="whitespace-pre-wrap text-gray-700">
                  {JSON.stringify(zap.trigger.metadata, null, 2)}
                </pre>
              </div>
            </div>

            {/* Actions List */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-white rounded-2xl shadow-md border border-green-100">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-green-700">
                ⚙️ Actions
              </h2>

              <div className="space-y-5">
                {zap.actions.length ? (
                  zap.actions.map((action, i) => (
                    <div
                      key={action.id}
                      className="border p-5 rounded-lg flex flex-col gap-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4">
                        {action.type?.image && (
                          <img
                            src={action.type.image}
                            alt={action.type.name}
                            className="w-8 h-8 mt-1 rounded-md"
                          />
                        )}
                        <h3 className="font-medium text-lg text-gray-800">
                          {i + 1}. {action.type?.name || "Unknown action"}
                        </h3>

                        <button
                          className="ml-auto text-red-500"
                          onClick={() => handleDeleteAction(action.id)}
                          disabled={deletingActionId === action.id}
                        >
                          {deletingActionId === action.id ? "Deleting..." : "Delete"}
                        </button>

                        <button
                          className="text-blue-500"
                          onClick={() => handleEditAction(action.id, action.metadata)}
                        >
                          Edit
                        </button>
                      </div>

                      {editingActionId === action.id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            className="w-full border p-2 rounded-md font-mono text-sm"
                            rows={8}
                            value={editedMetadata}
                            onChange={(e) => setEditedMetadata(e.target.value)}
                          />
                          <div className="flex gap-4">
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded"
                              onClick={() => handleSaveAction(action.id)}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-300 px-4 py-2 rounded"
                              onClick={() => setEditingActionId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap break-words text-gray-700 bg-gray-50 p-3 rounded-md text-sm mt-3 border border-gray-200 overflow-x-auto">
                          {JSON.stringify(action.metadata, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No actions configured. This zap will be deleted.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-lg font-medium">❌ Zap not found</p>
        )}
      </div>
    </>
  );
}
