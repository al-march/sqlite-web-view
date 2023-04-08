import { Table, flexRender } from "@tanstack/solid-table";
import { For, Show } from "solid-js";
import "./Table.css";

type Props<T> = {
  data?: Table<T>;
};

export function SqlTable<T>(props: Props<T>) {
  return (
    <Show when={props.data}>
      {(table) => (
        <div class="sql-table">
          <div class="sql-table-container">
            <div
              {...{
                class: "divTable",
                style: {
                  width: table().getTotalSize() + "px",
                },
              }}
            >
              <div class="sql-thead">
                <For each={table().getHeaderGroups()}>
                  {(headerGroup) => (
                    <div
                      {...{
                        key: headerGroup.id,
                        class: "tr",
                      }}
                    >
                      {headerGroup.headers.map((header) => (
                        <div
                          class="th"
                          style={{
                            width: header.getSize() + "px",
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                          <div
                            {...{
                              onMouseDown: header.getResizeHandler(),
                              onTouchStart: header.getResizeHandler(),
                              class: `resizer ${
                                header.column.getIsResizing()
                                  ? "isResizing"
                                  : ""
                              }`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </For>
              </div>
              <div
                {...{
                  class: "tbody",
                }}
              >
                <For each={table().getRowModel().rows}>
                  {(row) => (
                    <div class="tr">
                      <For each={row.getVisibleCells()}>
                        {(cell) => (
                          <div
                            class="td"
                            style={{
                              width: cell.column.getSize() + "px",
                            }}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}
