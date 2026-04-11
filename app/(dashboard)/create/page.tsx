import { Metadata } from "next"
import { CreateForm } from "@/components/dashboard/CreateForm"

export const metadata: Metadata = { title: "Create" }

export default function CreatePage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">New repurpose</h1>
        <p className="text-muted-foreground">Paste a URL, drop in text, or upload a document.</p>
      </div>
      <CreateForm />
    </div>
  )
}
