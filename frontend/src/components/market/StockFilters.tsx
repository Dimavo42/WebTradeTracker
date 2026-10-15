import { useState } from "react";
import Button from "../common/Button";
import { DEFAULT_FILTERS } from "../../hooks/useMarketStocks";
import type {
  AssetType,
  MarketFilterOptions,
  MarketStockFilters,
} from "../../types/stock";
import styles from "./StockFilters.module.css";

const MAX_SEARCH_LENGTH = 50;

type FilterForm = {
  search: string;
  country: string;
  type: AssetType;
  sector: string;
  limit: number;
};

const emptyForm: FilterForm = {
  search: "",
  country: DEFAULT_FILTERS.country,
  type: DEFAULT_FILTERS.type,
  sector: "",
  limit: DEFAULT_FILTERS.limit,
};

type StockFiltersProps = {
  options: MarketFilterOptions;
  loading: boolean;
  onApply: (filters: MarketStockFilters) => void;
  onReset: () => void;
};

export default function StockFilters({
  options,
  loading,
  onApply,
  onReset,
}: StockFiltersProps) {
  const [form, setForm] = useState<FilterForm>(emptyForm);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleChange = <K extends keyof FilterForm>(
    field: K,
    value: FilterForm[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      // sectors only apply to stocks
      ...(field === "type" && value !== "stock" ? { sector: "" } : {}),
    }));

    if (field === "search") setSearchError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const search = form.search.trim();

    if (search.length > MAX_SEARCH_LENGTH) {
      setSearchError(`Search must be at most ${MAX_SEARCH_LENGTH} characters`);
      return;
    }

    onApply({
      search: search || undefined,
      country: form.country,
      type: form.type,
      sector: form.sector || undefined,
      limit: form.limit,
    });
  };

  const handleReset = () => {
    setForm(emptyForm);
    setSearchError(null);
    onReset();
  };

  return (
    <form className={styles.panel} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className={`${styles.field} ${styles.searchField}`}>
          <label htmlFor="filter-search" className={styles.label}>
            Search
          </label>
          <input
            id="filter-search"
            type="text"
            className={`${styles.input} ${searchError ? styles.inputError : ""}`}
            placeholder="Company or ticker, e.g. Apple or AAPL"
            value={form.search}
            aria-invalid={!!searchError}
            aria-describedby={searchError ? "filter-search-error" : undefined}
            onChange={(e) => handleChange("search", e.target.value)}
          />
          {searchError && (
            <span id="filter-search-error" className={styles.error}>
              {searchError}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="filter-country" className={styles.label}>
            Country
          </label>
          <select
            id="filter-country"
            className={styles.input}
            value={form.country}
            onChange={(e) => handleChange("country", e.target.value)}
          >
            {options.countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="filter-type" className={styles.label}>
            Type
          </label>
          <select
            id="filter-type"
            className={styles.input}
            value={form.type}
            onChange={(e) => handleChange("type", e.target.value as AssetType)}
          >
            {options.types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="filter-sector" className={styles.label}>
            Sector
          </label>
          <select
            id="filter-sector"
            className={styles.input}
            value={form.sector}
            disabled={form.type !== "stock"}
            title={form.type !== "stock" ? "Sectors apply to stocks only" : undefined}
            onChange={(e) => handleChange("sector", e.target.value)}
          >
            <option value="">All sectors</option>
            {options.sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="filter-limit" className={styles.label}>
            Results
          </label>
          <select
            id="filter-limit"
            className={styles.input}
            value={form.limit}
            onChange={(e) => handleChange("limit", Number(e.target.value))}
          >
            {options.limits.map((n) => (
              <option key={n} value={n}>
                Top {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" size="medium" disabled={loading}>
          Search
        </Button>
        <Button type="button" variant="secondary" size="medium" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
