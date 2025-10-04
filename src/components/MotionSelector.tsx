import type { Motion } from "@/types/common";

interface MotionSelectorProps {
  motions: Motion[];
  selectedMotionId: string;
  strength: number;
  onMotionChange: (motionId: string) => void;
  onStrengthChange: (strength: number) => void;
  disabled?: boolean;
}

export default function MotionSelector({
  motions,
  selectedMotionId,
  strength,
  onMotionChange,
  onStrengthChange,
  disabled = false,
}: MotionSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="motion" className="block text-sm font-medium mb-2">
          Motion (optional)
        </label>
        <select
          id="motion"
          value={selectedMotionId}
          onChange={(e) => onMotionChange(e.target.value)}
          disabled={disabled}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">No motion (static)</option>
          {motions.map((motion) => (
            <option key={motion.id} value={motion.id}>
              {motion.name}
            </option>
          ))}
        </select>
      </div>

      {selectedMotionId && (
        <div>
          <label htmlFor="strength" className="block text-sm font-medium mb-2">
            Motion Strength: {strength.toFixed(2)}
          </label>
          <input
            id="strength"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={strength}
            onChange={(e) => onStrengthChange(parseFloat(e.target.value))}
            disabled={disabled}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Subtle</span>
            <span>Strong</span>
          </div>
        </div>
      )}
    </div>
  );
}
