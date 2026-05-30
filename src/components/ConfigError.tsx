interface Props {
  missing: string[];
}

export const ConfigError = ({ missing }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
      <div className="max-w-xl w-full rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Configuration required</h1>
        <p className="text-muted-foreground mb-4">
          The app can&apos;t start because some required environment variables are missing.
          This usually happens when the <code>.env</code> file was deleted or not regenerated.
        </p>

        <div className="rounded-lg bg-muted/40 p-4 mb-4">
          <p className="text-sm font-medium mb-2">Missing variables:</p>
          <ul className="list-disc list-inside text-sm font-mono">
            {missing.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>

        <div className="text-sm space-y-2">
          <p className="font-medium">How to fix:</p>
          <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
            <li>Copy <code>.env.example</code> to <code>.env</code> in the project root.</li>
            <li>Fill in the values from Lovable Cloud → Project settings.</li>
            <li>Restart the dev server.</li>
          </ol>
          <p className="text-muted-foreground pt-2">
            See <code>ENVIRONMENT_SETUP.md</code> for full details.
          </p>
        </div>
      </div>
    </div>
  );
};
