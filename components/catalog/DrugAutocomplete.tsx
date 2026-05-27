"use client";

import { useEffect, useMemo, useState } from "react";
import { searchDrugs } from "@/lib/catalog/catalogService";
import type { DrugCatalogItem } from "@/types/catalog";

interface DrugAutocompleteProps {
  value?: string;
  selectedDrugId?: string;
  customDrugName?: string;
  onSelectDrug: (item: DrugCatalogItem | null) => void;
  onCustomDrugNameChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DrugAutocomplete({
  value = "",
  selectedDrugId,
  customDrugName = "",
  onSelectDrug,
  onCustomDrugNameChange,
  label = "Drug",
  placeholder = "Search catalog drugs",
  disabled = false,
}: DrugAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DrugCatalogItem[]>([]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setLoading(true);
      void searchDrugs(trimmed)
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
    const selected = results.find((item) => item.id === selectedDrugId);
    return selected?.display_name;
  }, [results, selectedDrugId]);
  const showResults = query.trim().length >= 2 && results.length > 0;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[var(--color-text)]">{label}</label>
      <input
        value={query}
        disabled={disabled}
        onChange={(event) => {
          setQuery(event.target.value);
          onSelectDrug(null);
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
                onSelectDrug(item);
              }}
              className="w-full rounded-xl px-3 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-alt)]"
            >
              {item.display_name}
            </button>
          ))}
        </div>
      ) : null}

      <label className="block space-y-2">
        <span className="text-xs font-semibold text-[var(--color-muted)]">Manual fallback name</span>
        <input
          value={customDrugName}
          disabled={disabled}
          onChange={(event) => {
            onCustomDrugNameChange(event.target.value);
            if (event.target.value.trim()) {
              onSelectDrug(null);
            }
          }}
          placeholder="Type custom drug name"
          className="min-h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-text)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
        />
      </label>

      {selectedDrugId ? (
        <p className="text-xs text-[var(--color-muted)]">Selected catalog drug: {selectedLabel ?? selectedDrugId}</p>
      ) : null}
    </div>
  );
}
