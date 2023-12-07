import { Button, ButtonProps } from "@solsy/ui";
import { JSX, createSignal, splitProps } from "solid-js";

interface Props extends ButtonProps {
  inputAccept?: string;

  onFileLoad?: (f: File) => void;
}

export const FileButton = (props: Props) => {
  const [btnRef, setBtnRef] = createSignal<HTMLButtonElement>();
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const [local, others] = splitProps(props, ["onFileLoad", "inputAccept"]);

  function onClick() {
    inputRef().click();
  }

  function onChange() {
    const [file] = inputRef().files;
    if (file) {
      local.onFileLoad?.(file);
    }
  }

  return (
    <div>
      <Button onClick={onClick} ref={setBtnRef} {...others} />
      <input
        class="hidden"
        ref={setInputRef}
        accept={local.inputAccept}
        type="file"
        onChange={onChange}
      />
    </div>
  );
};
