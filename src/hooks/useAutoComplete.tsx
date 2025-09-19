import { useRef, useState, type ChangeEvent, type MouseEvent } from "react";
import type { User } from "../../lib/users";

type AutoCompleteProps = {
  delay?: number;
  source: (term: string) => void;
  onChange: (user: User) => void;
};

export default function useAutoComplete({
  delay = 500,
  source,
  onChange,
}: AutoCompleteProps) {
  const listRef = useRef<HTMLUListElement | null>(null);

  const [_timeout, _setTimeout] = useState(setTimeout(() => {}, 0));
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [isBusy, setBusy] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [textValue, setTextValue] = useState<string>("");

  function delayInvoke<T extends (...args: unknown[]) => unknown>(cb: T) {
    if (_timeout) {
      clearTimeout(_timeout);
    }

    _setTimeout(setTimeout(cb, delay));
  }

  function selectOption(index: number) {
    if (index > -1) {
      onChange(suggestions[index]);
      setTextValue(suggestions[index].name);
    }

    clearSuggestions();
  }

  async function getSuggestions(term: string) {
    if (term && source) {
      const options = await source(term);
      setSuggestions(options ?? []);
    }
  }

  function clearSuggestions() {
    setSuggestions([]);
    setSelectedIndex(-1);
  }

  function onTextChange(term: string) {
    setBusy(true);
    setTextValue(term);
    clearSuggestions();
    delayInvoke(() => {
      getSuggestions(term);
      setBusy(false);
    });
  }

  return {
    bindOption: {
      onClick: (e: MouseEvent<HTMLLIElement>) => {
        const target = e.target as HTMLElement;
        const nodes = Array.from(listRef.current?.children ?? []);
        const li = target.closest("li");
        if (li) {
          selectOption(nodes.indexOf(li));
        }
      },
    },
    bindInput: {
      value: textValue,
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        onTextChange(e.target.value),
    },
    bindOptions: {
      ref: listRef,
    },
    isBusy,
    suggestions,
    selectedIndex,
  };
}
