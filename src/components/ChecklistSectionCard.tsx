import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  ShieldCheck, 
  Table, 
  HelpCircle, 
  Sparkles,
  Zap,
  Info
} from 'lucide-react';
import { ChecklistItem } from '../data/productionChecklistData';
import { cyberSound } from '../utils/cyberSound';

interface ChecklistSectionCardProps {
  item: ChecklistItem;
  onToggleSubtask: (sectionId: string, subtaskId: string) => void;
  onMarkAllSection: (sectionId: string, done: boolean) => void;
}

export const ChecklistSectionCard: React.FC<ChecklistSectionCardProps> = ({
  item,
  onToggleSubtask,
  onMarkAllSection,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const totalTasks = item.subtasks.length;
  const completedTasks = item.subtasks.filter((s) => s.done).length;
  const isSectionComplete = totalTasks > 0 && totalTasks === completedTasks;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`rounded-2xl border transition-all duration-300 relative overflow-hidden ${
        isSectionComplete
          ? 'bg-[#090620] border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
          : 'bg-[#0c0722]/85 border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_20px_rgba(147,51,234,0.08)]'
      }`}
    >
      {/* Top Banner Accent Line */}
      <div className={`h-1 w-full ${
        isSectionComplete
          ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'
          : 'bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-400'
      }`} />

      {/* Card Header */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            {/* Number Pill */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-tech font-bold text-sm shrink-0 border shadow-inner ${
              isSectionComplete
                ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                : 'bg-purple-950/80 border-purple-500/50 text-fuchsia-400'
            }`}>
              {item.number}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                  // {item.categoryRange}
                </span>
                <span className="px-2 py-0.2 rounded bg-purple-950/90 border border-purple-800/40 text-[9px] font-mono text-purple-300">
                  {item.category}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-tech text-white uppercase tracking-wider">
                {item.title}
              </h3>
            </div>
          </div>

          {/* Right Controls: Progress Badge & Toggle Button */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
              isSectionComplete
                ? 'bg-emerald-950/90 border-emerald-500/70 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-[#08031a] border-purple-700/60 text-slate-300'
            }`}>
              {completedTasks}/{totalTasks} VERIFIED
            </span>

            <button
              onClick={() => {
                cyberSound.playClick();
                setIsExpanded(!isExpanded);
              }}
              className="p-1.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Expand or collapse section"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Short Summary */}
        <p className="text-xs sm:text-sm text-slate-300 font-light mt-3 leading-relaxed">
          {item.summary}
        </p>

        {/* Engineering Key Rule Callout Block (Straight from PDF) */}
        {item.keyRule && (
          <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-200 leading-relaxed shadow-inner flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-fuchsia-300 uppercase tracking-wider block text-[10px]">
                // CORE ENGINEERING MANDATE:
              </span>
              <p className="whitespace-pre-line text-slate-200">{item.keyRule}</p>
            </div>
          </div>
        )}
      </div>

      {/* Expandable Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-5 sm:px-6 pb-6 pt-2 border-t border-purple-900/40 space-y-5"
          >
            {/* Engineering Questions (if any) */}
            {item.questions && item.questions.length > 0 && (
              <div className="p-3.5 rounded-xl bg-black/50 border border-cyan-950 text-xs font-mono space-y-2">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px] uppercase">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>CRITICAL ENGINEERING QUESTIONS TO ANSWER:</span>
                </div>
                <ul className="space-y-1 text-slate-300 pl-4 list-disc">
                  {item.questions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Embedded Table Matrix (for Section 04, 11, 13, 18) */}
            {item.tableData && item.tableColumns && (
              <div className="overflow-x-auto rounded-xl border border-purple-900/60 bg-black/60 text-xs font-mono">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-purple-900/60 bg-purple-950/40 text-purple-300">
                      {item.tableColumns.map((col) => (
                        <th key={col.key} className="p-3 font-bold uppercase text-[11px]">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-purple-950/50 text-slate-300">
                    {item.tableData.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-purple-950/20 transition-colors">
                        {item.tableColumns!.map((col) => (
                          <td key={col.key} className="p-3">
                            {row[col.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Actionable Subtasks Checklist */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1">
                <span>VERIFICATION CHECKLIST ({completedTasks}/{totalTasks})</span>
                <button
                  onClick={() => {
                    cyberSound.playClick();
                    onMarkAllSection(item.id, !isSectionComplete);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-[11px]"
                >
                  {isSectionComplete ? 'Uncheck All' : 'Mark All Passed'}
                </button>
              </div>

              <div className="space-y-2">
                {item.subtasks.map((task) => (
                  <motion.div
                    key={task.id}
                    whileHover={{ x: 2 }}
                    onClick={() => {
                      cyberSound.playClick();
                      onToggleSubtask(item.id, task.id);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer select-none ${
                      task.done
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#080218] border-purple-950 hover:border-purple-800 text-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-cyan-400 hover:scale-110 transition-transform shrink-0"
                    >
                      {task.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-500" />
                      )}
                    </button>

                    <div className="flex-1 flex flex-wrap items-center justify-between gap-2">
                      <span className={task.done ? 'line-through opacity-80' : ''}>
                        {task.text}
                      </span>
                      {task.critical && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/50 text-[9px] text-amber-300 font-bold shrink-0">
                          CRITICAL GATE
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
