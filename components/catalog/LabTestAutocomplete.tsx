"use client";

import { useEffect, useMemo, useState } from "react";
import { searchLabTests } from "@/lib/catalog/catalogService";
import type { LabTestCatalogItem } from "@/types/catalog";

interface LabTestAutocompleteProps {
  value?: string;
  selectedTestId?: string;
  customTestName?: string;
  onSelectTest: (item: LabTestCatalogItem | null) => void;
  onCustomTestNameChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function LabTestAutocomplete({
  value = "",
  selectedTestId,
  customTestName = "",
  onSelectTest,
  onCustomTestNameChange,
  label = "Lab test",
  placeholder = "Search lab tests",
  disabled = false,
}: LabTestAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LabTestCatalogItem[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      void searchLabTests(trimmed)
        .then((items) => {
          setResults(items);
        })
        .catch(() => {
          setResults([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const selectedLabel = useMemo(() => {
    const selected = results.find((item) => item.id === selectedTestId);
    return selected?.display_name;
  }, [results, selectedTestId]);
  const showResults = query.trim().length >= 2 && results.length > 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[var(--color-text)]">{label}</label>
      <input
        value={query}
        disabled={disabled}
        onChange={(event) => {
          setQuery(event.target.value);
          onSelectTest(null);
        }}
        placeholder={placeholder}
        className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
      />

      {loading ? <p className="text-xs text-[var(--color-muted)]">Searching...</p> : null}

      {showResults ? (
        <div className="max-h-40 space-y-1 overflow-y-auto rounded-2xl border border-[var(--color-border)] p-2">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setQuery(item.display_name);
                onSelectTest(item);
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
            >
              <p>{item.display_name}</p>
              <p className="text-xs text-[var(--color-muted)]">
                {[item.category, item.sample_type ?? item.default_sample_type].filter(Boolean).join(" • ") || "-"}
              </p>
            </button>
          ))}
        </div>
      ) : null}

      <label className="block space-y-2">
        <span className="text-xs font-semibold text-[var(--color-muted)]">Manual fallback name</span>
        <input
          value={customTestName}
          disabled={disabled}
          onChange={(event) => {
            onCustomTestNameChange(event.target.value);
            if (event.target.value.trim()) {
              onSelectTest(null);
            }
          }}
          placeholder="Type custom test name"
          className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
        />
      </label>

      {selectedTestId ? (
        <p className="text-xs text-[var(--color-muted)]">Selected catalog test: {selectedLabel ?? selectedTestId}</p>
      ) : null}
    </div>
  );
}
