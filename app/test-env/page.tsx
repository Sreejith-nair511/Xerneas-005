export const dynamic = 'force-dynamic'

export default async function TestEnvPage() {
  // This will only work on the server side
  const apiKey = process.env.MISTRAL_API_KEY;
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variable Test</h1>
      <p>API Key exists: {apiKey ? 'Yes' : 'No'}</p>
      {apiKey && (
        <p>API Key preview: {apiKey.substring(0, 5)}...</p>
      )}
    </div>
  );
}