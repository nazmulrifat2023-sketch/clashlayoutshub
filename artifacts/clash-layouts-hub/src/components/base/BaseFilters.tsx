import { useTranslation } from "@/contexts/LanguageContext";

interface BaseFiltersProps {
  filters: {
    base_type: string;
    difficulty: string;
    sort: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

const baseTypes = ["", "War", "Farming", "Hybrid", "Trophy", "Anti 3 Star", "Anti Air", "Legend League", "Progress"];
const difficulties = ["", "Easy", "Medium", "Hard"];
const sorts = [
  { value: "latest", label: "Latest" },
  { value: "most_viewed", label: "Most Viewed" },
  { value: "top_rated", label: "Top Rated" },
  { value: "most_copied", label: "Most Copied" },
];

export function BaseFilters({ filters, onFilterChange }: BaseFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <select
        value={filters.base_type}
        onChange={e => onFilterChange("base_type", e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">{t.type}: All</option>
        {baseTypes.slice(1).map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>

      <select
        value={filters.difficulty}
        onChange={e => onFilterChange("difficulty", e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">{t.difficulty}: All</option>
        {difficulties.slice(1).map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={filters.sort}
        onChange={e => onFilterChange("sort", e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-2 bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      >
        <option value="">{t.sortBy}</option>
        {sorts.map(s => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>
    </div>
  );
}
