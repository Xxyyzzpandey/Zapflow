import { useState } from "react";
import { Input } from "@/components/input";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";

export function EmailSelector({setMetadata}: {
    setMetadata: (params: any) => void;
}) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [subject, setSubject] = useState("");
    const [senderName, setSenderName] = useState("");
    const [body, setBody] = useState("");

    return <div>
        <Input label={"from"} type={"text"} placeholder="from" onChange={(e) => setFrom(e.target.value)}></Input>
        <Input label={"to"} type={"text"} placeholder="to" onChange={(e) => setTo(e.target.value)}></Input>
        <Input label={"subject"} type={"text"} placeholder="subject" onChange={(e) => setSubject(e.target.value)}></Input>
        <Input label={"sender name"} type={"text"} placeholder="sender name" onChange={(e) => setSenderName(e.target.value)}></Input>
        <Input label={"Body"} type={"text"} placeholder="Body" onChange={(e) => setBody(e.target.value)}></Input>
        <div className="pt-2">
            <PrimaryButton onClick={() => {
                setMetadata({
                    from,
                    to,
                    subject,
                    senderName,
                    body
                })
            }}>Submit</PrimaryButton>
        </div>
    </div>
}


export function SolanaSelector({setMetadata}: {
    setMetadata: (params: any) => void;
}) {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");    

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setAddress(e.target.value)}></Input>
        <Input label={"Amount"} type={"text"} placeholder="To" onChange={(e) => setAmount(e.target.value)}></Input>
        <div className="pt-4">
        <PrimaryButton onClick={() => {
            setMetadata({
                amount,
                address
            })
        }}>Submit</PrimaryButton>
        </div>
    </div>
}




export function GithubSelector({ setMetadata }: { setMetadata: (metadata: any) => void }) {
  const [eventType, setEventType] = useState("pull_request");

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Select GitHub Event
        </label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="pull_request">Pull Request Opened</option>
          <option value="push">Push</option>
          <option value="issues">Issue Created</option>
          <option value="star">Repo Starred</option>
        </select>
      </div>

      <button
        onClick={() =>
          setMetadata({
            eventType, // e.g. "pull_request"
          })
        }
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Confirm
      </button>
    </div>
  );
}


export function DiscordSelector({ setMetadata }: { setMetadata: (metadata: any) => void }) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [content, setContent] = useState("");

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Webhook URL"
        value={webhookUrl}
        onChange={(e) => setWebhookUrl(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />
      <textarea
        placeholder="Message Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />
      <button
        className="px-4 py-2 bg-amber-800 text-white rounded hover:bg-amber-700"
        onClick={() =>
          setMetadata({
            webhookUrl,
            content,
          })
        }
      >
        Confirm
      </button>
    </div>
  );
}



export function TelegramSelector({ setMetadata }: { setMetadata: (metadata: any) => void }) {
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Bot Token</label>
        <input
          type="text"
          placeholder="123456:ABC-xyz..."
          value={botToken}
          onChange={(e) => setBotToken(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Chat ID</label>
        <input
          type="text"
          placeholder="e.g. 987654321"
          value={chatId}
          onChange={(e) => setChatId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          placeholder="Your Telegram message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        onClick={() => setMetadata({ botToken, chatId, message })}
      >
        Save
      </button>
    </div>
  );
}


export function NotionDocsSelector({ setMetadata }: { setMetadata: (metadata: any) => void }) {
  const [notionKey, setNotionKey] = useState("");
  const [databaseId, setDatabaseId] = useState("");

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Notion Key</label>
        <input
          type="text"
          placeholder="Enter Notion Integration Key"
          value={notionKey}
          onChange={(e) => setNotionKey(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Database ID</label>
        <input
          type="text"
          placeholder="Enter Notion Database ID"
          value={databaseId}
          onChange={(e) => setDatabaseId(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      <button
        className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
        disabled={!notionKey || !databaseId}
        onClick={() => setMetadata({ notionKey, databaseId })}
      >
        Save
      </button>
    </div>
  );
}
