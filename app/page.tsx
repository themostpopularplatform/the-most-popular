import { supabase } from "../lib/supabase"

export default async function Home() {
  const { data, error } = await supabase.from("test").select("*")

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>

      {error && (
        <pre className="text-red-500">
          {JSON.stringify(error, null, 2)}
        </pre>
      )}

      {data && (
        <pre className="text-green-500">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </main>
  )
}