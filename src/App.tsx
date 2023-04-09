import { Show, createSignal, onMount } from "solid-js";
import initSqlJs from "sql.js";
import { Database } from "sql.js";
import "./App.css";
import { SqlDB } from "./components/SqlDB";

export const App = () => {
  const [db, setDb] = createSignal<Database>();

  onMount(async () => {
    setDb(await initDB("/assets/db/oxford.db"));
  });

  return (
    <main style="overflow-x: auto">
      <Show when={db()} fallback={<p>Loading...</p>}>
        {(db) => <SqlDB db={db()} />}
      </Show>
    </main>
  );
};

async function initDB(dbUrl: string) {
  const dbFile = await fetchFile(dbUrl)
    .then((data) => data.blob())
    .then((blob) => blob.arrayBuffer());
  const buffer = new Uint8Array(dbFile);

  const sql = await initSqlJs({
    locateFile: () => `/assets/sql-wasm.wasm`,
  });
  return new sql.Database(buffer);
}

async function fetchFile(file: string) {
  return fetch(file);
}
