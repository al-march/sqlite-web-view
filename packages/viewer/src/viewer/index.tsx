import { createSignal, onMount } from "solid-js";
import { Show } from "solid-js/web";
import { Database } from "sql.js";
import { SqlDB } from "./components/SqlDB";
import initSqlJs from "sql.js";

export type SqliteViewerProps = {
  db: ArrayLike<number> | Buffer;
};

export const SqliteViewer = (props: SqliteViewerProps) => {
  const [db, setDb] = createSignal<Database>();

  onMount(async () => {
    setDb(await initDB());
  });

  async function initDB() {
    const sql = await initSqlJs({
      locateFile: () => `/assets/sql-wasm.wasm`,
    });

    return new sql.Database(props.db);
  }

  return (
    <Show when={db()} fallback={<p>Loading...</p>}>
      {(db) => <SqlDB db={db()} />}
    </Show>
  );
};
