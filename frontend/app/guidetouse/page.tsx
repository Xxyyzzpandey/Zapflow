// app/guide/page.tsx
"use client";

import { useState } from "react";
import { Appbar } from "@/components/Appbar";

const guides = {
  "Webhook Trigger": (
    <div className="space-y-2">
      <p>Steps to set up a Webhook trigger:</p>
      <ol className="list-decimal pl-5">
        <li>Copy the unique Webhook URL from your Zap setup.</li>
        <li>
          Send a <code>POST</code> request with JSON payload to that URL.
        </li>
        <li>
          Example using <b>cURL</b>:
          <pre className="bg-gray-700 text-green-300 p-3 rounded-lg text-sm overflow-x-auto">
{`curl -X POST ${"{{your_webhook_url}}"} \\
-H "Content-Type: application/json" \\
-d '{"name":"Ankit","email":"ankit@example.com"}'`}
          </pre>
        </li>
        <li>
          The payload data will be available in Mustache templates, e.g.{" "}
          <code>{"{{name}}"}</code>, <code>{"{{email}}"}</code>.
        </li>
      </ol>
    </div>
  ),

  "Google Form Trigger": (
    <div className="space-y-2">
      <p>Steps to connect Google Form with your Zap:</p>
      <ol className="list-decimal pl-5">
        <li>Open your Google Form.</li>
        <li>Click the 3 dots (⋮) → <b>Script Editor</b>.</li>
        <li>Paste the script below:</li>
        <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-sm overflow-x-auto">
{`var POST_URL = "your webhook url";

function onSubmit(e) {
    var form = FormApp.getActiveForm();
    var allResponses = form.getResponses();
    var latestResponse = allResponses[allResponses.length - 1];
    var response = latestResponse.getItemResponses();
    var payload = {};
    for (var i = 0; i < response.length; i++) {
        var question = response[i].getItem().getTitle();
        var answer = response[i].getResponse();
        payload[question] = answer;
    }

    var options = {
        "method": "post",
        "contentType": "application/json",
        "payload": JSON.stringify(payload)
    };
UrlFetchApp.fetch(POST_URL, options);
};
`}
        </pre>
        <li>
          Go to <b>Triggers</b> (clock icon in Apps Script) → Add Trigger → choose{" "}
          <code>onFormSubmit</code> → Event type: <b>On form submit</b>.
        </li>
        <li>
          Now every form submission will send data to your Zap as JSON.
        </li>
        <li>
          Example placeholders: <code>{"{{Email}}"}</code>,{" "}
          <code>{"{{Name}}"}</code>.
        </li>
      </ol>
    </div>
  ),

  "Email Action": (
    <div className="space-y-2">
      <p>Fill the fields like this:</p>
      <ul className="list-disc pl-5">
        <li>
          <b>To</b>: Recipient email (supports Mustache, e.g.{" "}
          <code>{"{{form.email}}"}</code>)
        </li>
        <li>
          <b>Subject</b>: e.g. <code>{"New PR by {{pull_request.user.login}}"}</code>
        </li>
        <li><b>Body</b>: Email content</li>
      </ul>
    </div>
  ),

  "Discord Action": (
    <div className="space-y-2">
      <p>Steps to configure Discord webhook:</p>
      <ol className="list-decimal pl-5">
        <li>Go to Discord server → Settings → Integrations.</li>
        <li>Create a new <b>Webhook</b>.</li>
        <li>Copy the Webhook URL.</li>
        <li>Paste it in your Zap action setup with a message.</li>
      </ol>
    </div>
  ),

  "Telegram Action": (
    <div className="space-y-2">
      <p>Steps to configure Telegram Bot:</p>
      <ol className="list-decimal pl-5">
        <li>Create a bot using <b>@BotFather</b> and copy Bot Token.</li>
        <li>Get your <b>Chat ID</b> using the Telegram API.</li>
        <li>Fill Bot Token, Chat ID, and Message in your action setup.</li>
      </ol>
    </div>
  ),

  "GitHub Trigger": (
    <div className="space-y-2">
      <p>Steps to set up GitHub webhook:</p>
      <ol className="list-decimal pl-5">
        <li>Go to repo → Settings → Webhooks.</li>
        <li>Add Webhook URL from your Zap setup.</li>
        <li>Select events: Push, Pull Request, Issues, etc.</li>
        <li>
          Example fields:{" "}
          <code>{"{{pull_request.user.login}}"}</code>,{" "}
          <code>{"{{issue.title}}"}</code>
        </li>
      </ol>
    </div>
  ),
};

// GitHub event formats + placeholders
const githubFormats = {
  Push: (
    <div className="space-y-3">
      <p><b>Push event JSON format:</b></p>
      <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "ref": "refs/heads/main",
  "head_commit": { "message": "Fix bug" },
  "pusher": { "name": "Ankit" }
}`}
      </pre>
      <p><b>Available placeholders:</b></p>
      <ul className="list-disc pl-5 text-sm">
        <li><code>{"{{ref}}"}</code> → branch ref</li>
        <li><code>{"{{head_commit.message}}"}</code> → last commit message</li>
        <li><code>{"{{pusher.name}}"}</code> → person who pushed</li>
      </ul>
    </div>
  ),
  "Pull Request": (
    <div className="space-y-3">
      <p><b>Pull Request event JSON format:</b></p>
      <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "action": "opened",
  "pull_request": { "title": "Add feature", "user": { "login": "ankit" } }
}`}
      </pre>
      <p><b>Available placeholders:</b></p>
      <ul className="list-disc pl-5 text-sm">
        <li><code>{"{{action}}"}</code> → action taken (opened/closed/merged)</li>
        <li><code>{"{{pull_request.title}}"}</code> → PR title</li>
        <li><code>{"{{pull_request.user.login}}"}</code> → PR author</li>
      </ul>
    </div>
  ),
  Issues: (
    <div className="space-y-3">
      <p><b>Issues event JSON format:</b></p>
      <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "action": "opened",
  "issue": { "title": "Bug in code", "user": { "login": "ankit" } }
}`}
      </pre>
      <p><b>Available placeholders:</b></p>
      <ul className="list-disc pl-5 text-sm">
        <li><code>{"{{action}}"}</code> → action taken (opened/closed/reopened)</li>
        <li><code>{"{{issue.title}}"}</code> → issue title</li>
        <li><code>{"{{issue.user.login}}"}</code> → issue author</li>
      </ul>
    </div>
  ),
  Stars: (
    <div className="space-y-3">
      <p><b>Star event JSON format:</b></p>
      <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "action": "created",
  "repository": { "name": "my-repo" },
  "sender": { "login": "ankit" }
}`}
      </pre>
      <p><b>Available placeholders:</b></p>
      <ul className="list-disc pl-5 text-sm">
        <li><code>{"{{action}}"}</code> → created/removed</li>
        <li><code>{"{{repository.name}}"}</code> → repository name</li>
        <li><code>{"{{sender.login}}"}</code> → user who starred/unstarred</li>
      </ul>
    </div>
  ),
};

// Google Form example format
const googleFormFormat = (
  <div className="space-y-3">
    <p><b>Google Form submission JSON format:</b></p>
    <pre className="bg-gray-900 text-green-300 p-3 rounded-lg text-sm overflow-x-auto">
{`{
  "Name": ["Ankit"],
  "Email": ["ankit@example.com"],
  "Message": ["Hello World"]
}`}
    </pre>
    <p><b>Available placeholders:</b></p>
    <ul className="list-disc pl-5 text-sm">
      <li><code>{"{{Name}}"}</code> → form field "Name"</li>
      <li><code>{"{{Email}}"}</code> → form field "Email"</li>
      <li><code>{"{{Message}}"}</code> → form field "Message"</li>
    </ul>
  </div>
);

export default function GuidePage() {
  const [selected, setSelected] = useState<string>("");
  const [format, setFormat] = useState<string>("");

  return (
    <>
      <Appbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">📘 Integration Guide</h1>

        {/* First Dropdown */}
        <label className="block text-lg font-medium mb-2">
          Select a Trigger or Action
        </label>
        <select
          value={selected}
          onChange={(e) => {
            setSelected(e.target.value);
            setFormat(""); // reset if changing main option
          }}
          className="w-full border px-3 py-2 rounded-lg mb-6"
        >
          <option value="">-- Choose an option --</option>
          {Object.keys(guides).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>

        <div className="bg-gray-50 p-4 rounded-lg border mb-6">
          {selected ? guides[selected as keyof typeof guides] : <p>⬆️ Choose a guide from the dropdown.</p>}
        </div>

        {/* Second Dropdown */}
       
            <label className="block text-lg font-medium mb-2">
              Select GitHub Event Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-6"
            >
              <option value="">-- Choose GitHub event --</option>
              {Object.keys(githubFormats).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <div className="bg-gray-50 p-4 rounded-lg border">
              {format
                ? githubFormats[format as keyof typeof githubFormats]
                : <p>⬆️ Choose a GitHub event format.</p>}
            </div>
          

        {selected === "Google Form Trigger" && (
          <div className="bg-gray-50 p-4 rounded-lg border">
            {googleFormFormat}
          </div>
        )}
      </div>
    </>
  );
}
