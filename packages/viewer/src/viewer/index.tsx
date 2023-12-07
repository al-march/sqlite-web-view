import { createSignal, onMount } from "solid-js";
import { Show } from "solid-js/web";
import { Database } from "sql.js";
import { SqlDB } from "./components/SqlDB";
import initSqlJs from "sql.js";

export type SqliteViewerProps = {
  db: ArrayLike<number> | Buffer;
  wasm?: ArrayBuffer;
};

export const SqliteViewer = (props: SqliteViewerProps) => {
  const [db, setDb] = createSignal<Database>();

  onMount(async () => {
    setDb(await initDB());
  });

  async function initDB() {
    const sql = await getSQL();
    return new sql.Database(props.db);
  }

  // Try to init sql with wasm as binary 
  async function getSQL() {
    if (props.wasm) {
      return await initSqlJs({
        wasmBinary: props.wasm,
      });
    }
  }

  return (
    <Show when={db()} fallback={<p>Loading...</p>}>
      {(db) => <SqlDB db={db()} />}
    </Show>
  );
};
