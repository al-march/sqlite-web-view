import { Show, createSignal, onMount } from "solid-js";
import { SqliteViewer } from "./viewer";
import { FileButton } from "./components";
import "./App.css";

export const App = () => {
  const [db, setDb] = createSignal<Uint8Array>();
  const [wasm, setWasm] = createSignal<ArrayBuffer>();

  onMount(async () => {
    setWasm(await getWasm());
  });

  async function dbFromFile(file: File) {
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    setDb(uint8Array);
  }

  return (
    <main class="h-screen p-4 flex flex-col gap-2 overflow-hidden">
      <section>
        <FileButton onFileLoad={dbFromFile}>Load DB</FileButton>

        <input type="file" class="hidden" />
      </section>

      <Show when={db()}>
        {(db) => <SqliteViewer db={db()} wasm={wasm()} />}
      </Show>
    </main>
  );
};

async function initDB(dbUrl: string) {
  const dbFile = await fetchFile(dbUrl)
    .then((data) => data.blob())
    .then((blob) => blob.arrayBuffer());
  return new Uint8Array(dbFile);
}

async function getWasm() {
  const url = "/assets/sql-wasm.wasm";
  return fetchFile(url)
    .then((data) => data.blob())
    .then((blob) => blob.arrayBuffer());
}

async function fetchFile(file: string) {
  return fetch(file);
}
