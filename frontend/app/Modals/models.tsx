
import { useState } from "react";
import { HOOKS_URL } from "@/app/config";
     
import { DiscordSelector,SolanaSelector,EmailSelector,TelegramSelector,NotionDocsSelector} from "../functions/Selector";


export function Modal({ index, onSelect, availableItems }: { index: number, onSelect: (props: null | { name: string; id: string; metadata: any; }) => void, availableItems: {id: string, name: string, image: string;}[] }) {
      
     const githubEvents = [
       { id: "pull_request", label: "Pull Request" },
       { id: "push", label: "Push" },
       { id: "star", label: "Star" },
       { id: "issues", label: "Issue Created" },
     ];

     const [showGithubPopup, setShowGithubPopup] = useState(false);
     const [selectedGithubEvent, setSelectedGithubEvent] = useState<string | null>(null);
     const [repoName, setRepoName] = useState(""); // user can enter "org/repo"
     const [selectDiscordPopup,setSelectDiscordPopup]=useState(false);
     const [showGoogleFormPopup, setShowGoogleFormPopup] = useState(false);
     const [showNotionDocsPopup, setShowNotionDocsPopup] = useState(false);
     const [notionKey, setNotionKey] = useState("");
     const [databaseId, setDatabaseId] = useState("");

      
    const [step, setStep] = useState(0);
    const [selectedAction, setSelectedAction] = useState<{
        id: string;
        name: string;
    }>();
   
    

    const isTrigger = index === 1;
    return <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                    <div className="text-xl">
                        Select {index === 1 ? "Trigger" : "Action"}
                    </div>
                    <button onClick={() => {
                        onSelect(null);
                    }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                
                <div className="p-4 md:p-5 space-y-4">
                    {step === 1 && selectedAction?.name === "email" && <EmailSelector setMetadata={(metadata) => {
                        console.log(metadata)
                        onSelect({
                            ...selectedAction,
                            metadata
                        })
                    }} />}

                    {(step === 1 && selectedAction?.name === "solana") && <SolanaSelector setMetadata={(metadata) => {
                        console.log(metadata)
                        onSelect({
                            ...selectedAction,
                            metadata
                        })
                    }} 
                    />}
                    {step === 1 && selectedAction?.name === "Discord" && (
                       <DiscordSelector
                         setMetadata={(metadata) => {
                           console.log("Discord metadata:", metadata);
                           onSelect({
                             ...selectedAction,
                             metadata,
                           });
                         }}
                       />
                     )}
                     {step === 1 && selectedAction?.name === "Telegram" && (
                        <TelegramSelector
                          setMetadata={(metadata) => {
                            console.log("Telegram metadata:", metadata);
                            onSelect({
                              ...selectedAction,
                              metadata,
                            });
                          }}
                        />
                      )}
                      {step === 1 && selectedAction?.name === "Notion_docs" && (
                      <NotionDocsSelector 
                      setMetadata={(metadata) => 
                        onSelect({
                           ...selectedAction, 
                           metadata 
                          })}
                      />
     )}

                    {step === 0 && Array.isArray(availableItems) &&<div>{availableItems?.map(({id, name, image}) => {  
                            return <div key={id} onClick={() => {
                                if (isTrigger) {
                                    if (name === "google-form") {
                              // if google-form trigger selected
                              setShowGoogleFormPopup(true);
                             }else if (name === "Github") {
                               setShowGithubPopup(true);
                             }else if (name === "Discord") {
                               setSelectDiscordPopup(true);
                             } else if (name === "Notion_docs") {
                               setShowNotionDocsPopup(true);
                             } else {
                                onSelect({
                                    id,
                                    name,
                                    metadata: {}
                             })}
                                } else {
                                    setStep(s => s + 1);
                                    setSelectedAction({
                                        id,
                                        name
                                    })
                                }
                            }} className="flex border p-4 cursor-pointer hover:bg-slate-100">
                                <img src={image} width={30} className="rounded-full" /> <div className="flex flex-col justify-center"> {name} </div>
                            </div>
                        })}</div>}                    
                </div>
            </div>
        </div>
         {showGoogleFormPopup && (
               <div className="fixed inset-0 flex items-center justify-center bg-slate-100 bg-opacity-70 z-50 p-4 overflow-y-auto">
                <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
                    <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                    Steps to set up webhook on Google Form
                    </h2>

                    <ol className="list-decimal pl-5 text-gray-700 space-y-2 mb-6 text-sm md:text-base">
                    <li>Open your Google Form.</li>
                    <li>Click the 3 dots (⋮) in the top-right corner and select <strong>'Script Editor'</strong>.</li>
                    <li>In the Apps Script editor, paste the provided code snippet below.</li>

                    <div className="bg-gray-900 text-green-300 p-4 rounded-lg text-xs md:text-sm overflow-x-auto whitespace-pre-wrap max-w-full break-words">
                        <pre>
                {`
                function onFormSubmit(e) {
                var formData = e.namedValues;

                var options = {
                    "method": "post",
                    "contentType": "application/json",
                    "payload": JSON.stringify(formData)
                };

                UrlFetchApp.fetch("${HOOKS_URL}/hooks/catch/1/{zapId}", options);
                }
                `}
                        </pre>
                    </div>

                    <li><strong>Replace the webhook URL</strong> in the code with your generated Zapier clone webhook URL.</li>
                    <li>Save the script.</li>
                    <li>Go to <strong>Triggers</strong> (clock icon on left sidebar) → Click 'Add Trigger'.</li>
                    <li>Select <strong>'onFormSubmit'</strong> function, Event type <strong>'On form submit'</strong>, then save.</li>
                    <li>Now, every time someone submits the form, it'll send data to your Zap.</li>
                    </ol>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                    <button
                        onClick={() => setShowGoogleFormPopup(false)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                        onSelect({
                            id: "google-form-id",
                            name: "google-form",
                            metadata: {},
                        });
                        setShowGoogleFormPopup(false);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                    >
                        Confirm
                    </button>
                    </div>
                </div>
                </div>
          )}

          {showGithubPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-100 bg-opacity-70 z-50 p-4 overflow-y-auto">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
      <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
        Configure GitHub Trigger
      </h2>

      {/* Repo input */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Repository (org/repo)</label>
        <input
          type="text"
          placeholder="e.g. facebook/react"
          value={repoName}
          onChange={(e) => setRepoName(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Event selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Event Type</label>
        <select
          value={selectedGithubEvent ?? ""}
          onChange={(e) => setSelectedGithubEvent(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select event</option>
          {githubEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>{ev.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
        <button
          onClick={() => setShowGithubPopup(false)}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
         
        <button
          disabled={!repoName || !selectedGithubEvent}
          onClick={() => {
            onSelect({
              id: "abcd-abcd-avdd",
              name: "GitHub",
              metadata: {
                repo: repoName,
                eventType: selectedGithubEvent,
              },
            });
            setShowGithubPopup(false);
          }}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition disabled:bg-gray-400"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
)}
{showNotionDocsPopup && (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-100 bg-opacity-70 z-50 p-4 overflow-y-auto">
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                Configure Notion Docs Trigger
            </h2>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notion Key</label>
                <input
                    type="text"
                    placeholder="Enter Notion Integration Key"
                    value={notionKey}
                    onChange={(e) => setNotionKey(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Database ID</label>
                <input
                    type="text"
                    placeholder="Enter Notion Database ID"
                    value={databaseId}
                    onChange={(e) => setDatabaseId(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                    onClick={() => setShowNotionDocsPopup(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                    Cancel
                </button>

                <button
                    disabled={!notionKey || !databaseId}
                    onClick={() => {
                        onSelect({
                            id: "notion-notion",
                            name: "Notion_docs",
                            metadata: {
                                notionKey,
                                databaseId
                            }
                        });
                        setShowNotionDocsPopup(false);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition disabled:bg-gray-400"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
)}


    </div>
    
}