import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function PrivacyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 underline underline-offset-2 transition-colors cursor-pointer">
          Privacy & Analytics
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            We prioritize your privacy. Here is how we handle your data.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm space-y-4 text-slate-600 dark:text-slate-300">
          <p>
            This website uses <strong>Umami Analytics</strong> to anonymously collect usage statistics (like page views and device types) to help us improve the app.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>No Cookies:</strong> We do not set any tracking cookies.</li>
            <li><strong>No PII:</strong> Your IP address and personal data are never stored.</li>
            <li><strong>GDPR Compliant:</strong> Your data is owned by us and never sold to third parties.</li>
            <li><strong>Do Not Track:</strong> We respect your browser's 'Do Not Track' setting</li>
          </ul>
          <p className="text-xs text-slate-400">
            For more technical details, visit <a href="https://umami.is" target="_blank" className="underline">umami.is</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}