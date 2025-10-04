import { DOP_MODELS, type DoPModelInfo } from "@/types/common";

interface ModelSelectorProps {
  selectedModel: "lite" | "standard" | "turbo";
  onModelChange: (model: "lite" | "standard" | "turbo") => void;
  disabled?: boolean;
}

export default function ModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
}: ModelSelectorProps) {
  return (
    <div>
      <label htmlFor="model" className="block text-sm font-medium mb-2">
        Model Quality
      </label>
      <select
        id="model"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value as "lite" | "standard" | "turbo")}
        disabled={disabled}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {DOP_MODELS.map((model: DoPModelInfo) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.description}
          </option>
        ))}
      </select>
      <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
        {DOP_MODELS.map((model: DoPModelInfo) => (
          <div
            key={model.id}
            className={`p-2 rounded ${
              selectedModel === model.id
                ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <div className="font-semibold">{model.name}</div>
            <div className="text-gray-600 dark:text-gray-400">{model.cost}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
