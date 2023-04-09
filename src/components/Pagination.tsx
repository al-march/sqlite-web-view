import { createMemo } from "solid-js";
import { ISqlPagination } from "../models/SqlTable.model";
import { Button, Input, Row } from "@solsy/ui";
import "./Pagination.css";

export interface SqlPaginationProps {
  pagination: ISqlPagination;
  pageCount?: number;

  onPageSize?: (value: number) => void;
  onPageIndex?: (value: number) => void;
}

export const SqlPagination = (props: SqlPaginationProps) => {
  const isPrevDisabled = createMemo(() => {
    return props.pagination.pageIndex === 0;
  });

  const isNextDisabled = createMemo(() => {
    return props.pagination.pageIndex + 1 === props.pageCount;
  });

  function onPageSize(value: number) {
    props.onPageSize?.(value);
  }

  function onPageIndex(value: number) {
    props.onPageIndex?.(value);
  }

  function onPrev() {
    const count = props.pagination.pageIndex;
    onPageIndex(count - 1);
  }

  function onNext() {
    const count = props.pagination.pageIndex;
    onPageIndex(count + 1);
  }

  function onStart() {
    onPageIndex(0);
  }

  function onEnd() {
    onPageIndex((props.pageCount || 1) - 1);
  }

  function onInputChange(input: HTMLInputElement) {
    const value = Number(input.value);

    if (value > props.pageCount) {
      input.value = props.pageCount.toString();
    }

    if (value < 1) {
      input.value = "1";
    }

    onPageIndex(Number(input.value) - 1);
  }

  return (
    <Row class="gap-2" items="center">
      <Row>
        <Button size="xs" square onClick={onStart} disabled={isPrevDisabled()}>
          {"<<"}
        </Button>
        <Button size="xs" square onClick={onPrev} disabled={isPrevDisabled()}>
          {"<"}
        </Button>
        <Button size="xs" square onClick={onNext} disabled={isNextDisabled()}>
          {">"}
        </Button>
        <Button size="xs" square onClick={onEnd} disabled={isNextDisabled()}>
          {">>"}
        </Button>
      </Row>

      <Row items="center" class="gap-2 p-1">
        Page{" "}
        <Input
          bordered
          class="w-[50px] placeholder:text-base input-without-arrows"
          size="xs"
          value={props.pagination.pageIndex + 1}
          type="number"
          onChange={(e) => onInputChange(e.currentTarget)}
        />{" "}
        of <b>{props.pageCount || 0}</b>
      </Row>

      <select
        class="select select-xs select-bordered"
        value={props.pagination.pageSize}
        onChange={(e) => onPageSize(Number(e.currentTarget.value))}
      >
        <option value={10}>10</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </Row>
  );
};
