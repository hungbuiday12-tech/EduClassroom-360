import { useCallback, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigation } from '../context/NavigationContext';
import { BackgroundStyle, useBackgroundTheme } from '../context/BackgroundContext';
import { useFocusTimer } from '../context/FocusTimerContext';
import { safeFetchJson } from '../lib/apiClient';
import {
  buildLocalVoiceMentorAnswer,
  buildVoiceClarifyPlan,
  matchFuzzyVoiceOSCommand
} from '../lib/voiceIntentEngine';
import {
  cancelActiveSpeech,
  captureWorkspaceSnapshot,
  requestLiveCoPilotReply,
  useLiveWorkspaceContext
} from '../lib/liveCoPilotBridge';
import { SubjectType, VoiceOSActionPlan, VoiceOSClarifyOption } from '../types';

export interface VoiceOSLogEntry {
  id: string;
  role: 'user' | 'os';
  text: string;
  clarifyOptions?: VoiceOSClarifyOption[];
}

interface UseVoiceOSControllerOptions {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenTutor: (subject?: SubjectType, promptText?: string) => void;
  onCloseParent?: () => void;
  initialGreeting?: boolean;
}

export function useVoiceOSController({
  isDark,
  onToggleTheme,
  onOpenTutor,
  onCloseParent,
  initialGreeting = false
}: UseVoiceOSControllerOptions) {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const { navigate, selectSubject } = useNavigation();
  const { setBgStyle } = useBackgroundTheme();
  const { isRunning, startPause, resetTimer } = useFocusTimer();
  const workspaceCtx = useLiveWorkspaceContext();

  const [processing, setProcessing] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [visionCoPilot, setVisionCoPilot] = useState(true);
  const [logs, setLogs] = useState<VoiceOSLogEntry[]>(() =>
    initialGreeting
      ? [
          {
            id: 'init',
            role: 'os',
            text: isEn
              ? 'Synapse Voice OS ready. Speak naturally — if anything is unclear, I will ask to confirm before navigating.'
              : 'Synapse Voice OS đã sẵn sàng! Ra lệnh tự nhiên hoặc hỏi kiến thức — nếu nghe chưa rõ mình sẽ hỏi lại bạn ngay, không tự chuyển nhầm.'
          }
        ]
      : []
  );

  const appendLog = useCallback((entry: Omit<VoiceOSLogEntry, 'id'>) => {
    setLogs((prev) => [
      ...prev.slice(-8),
      { ...entry, id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}` }
    ]);
  }, []);

  const speakFeedback = useCallback(
    (text: string) => {
      if (!ttsEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      try {
        cancelActiveSpeech();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = isEn ? 'en-US' : 'vi-VN';
        utter.rate = 1.06;
        window.speechSynthesis.speak(utter);
      } catch {}
    },
    [ttsEnabled, isEn]
  );

  const executePlan = useCallback(
    (plan: VoiceOSActionPlan) => {
      const reply = plan.replyVi || (isEn ? 'Command executed.' : 'Đã thực hiện lệnh.');
      appendLog({
        role: 'os',
        text: reply,
        clarifyOptions: plan.actionType === 'clarify' ? plan.clarifyOptions : undefined
      });
      speakFeedback(reply);

      switch (plan.actionType) {
        case 'clarify':
        case 'answer_qa':
        case 'none':
          break;
        case 'navigate':
          if (plan.targetSubject) {
            selectSubject(plan.targetSubject);
          }
          break;
        case 'navigate_math_sim':
          navigate({
            subject: 'math_sims',
            mathTab: plan.targetMathTab || 'grapher',
            tutorOpen: false
          });
          break;
        case 'navigate_monument':
          navigate({
            subject: 'synapse_v2',
            futureTab: 'megastructures',
            synapseMode: 'stage',
            synapseMonumentId: plan.targetMonumentId || 'dyson',
            tutorOpen: false
          });
          break;
        case 'navigate_future':
          if (plan.targetFutureTab === 'infinite_canvas') {
            window.dispatchEvent(new CustomEvent('synapse:open-scratchpad-mini'));
            onCloseParent?.();
            break;
          }
          navigate({
            subject: 'synapse_v2',
            futureTab: plan.targetFutureTab || 'megastructures',
            synapseMode: 'catalog',
            tutorOpen: false
          });
          break;
        case 'set_background':
          if (plan.bgStyle) {
            setBgStyle(plan.bgStyle as BackgroundStyle);
          }
          break;
        case 'toggle_theme':
          if (typeof plan.darkMode === 'boolean') {
            if (plan.darkMode !== isDark) onToggleTheme();
          } else {
            onToggleTheme();
          }
          break;
        case 'timer':
          if (plan.timerAction === 'start' && !isRunning) startPause();
          else if (plan.timerAction === 'pause' && isRunning) startPause();
          else if (plan.timerAction === 'reset') resetTimer();
          break;
        case 'open_tutor':
          onOpenTutor(plan.tutorSubject || 'math', plan.tutorQuestion);
          onCloseParent?.();
          break;
        default:
          break;
      }
    },
    [
      appendLog,
      isDark,
      isEn,
      isRunning,
      navigate,
      onCloseParent,
      onOpenTutor,
      onToggleTheme,
      resetTimer,
      selectSubject,
      setBgStyle,
      speakFeedback,
      startPause
    ]
  );

  const runCommand = useCallback(
    async (rawText: string, sttConfidence = 1) => {
      const clean = rawText.trim();
      if (!clean) return;
      cancelActiveSpeech();
      appendLog({ role: 'user', text: clean });

      // 1. Clarification-aware local intent matcher
      const localPlan = matchFuzzyVoiceOSCommand(clean, sttConfidence);
      if (localPlan) {
        executePlan(localPlan);
        return;
      }

      // 2. Live Screen/Canvas Vision Co-Pilot when user asks about visible workspace
      const asksAboutScreen =
        /(màn hình|đây|hình|code|lỗi|sai|giải thích|phân tích|tại sao|cái này|this|screen|why|wrong|fix)/i.test(
          clean
        );
      if (visionCoPilot && asksAboutScreen) {
        setProcessing(true);
        const snap = await captureWorkspaceSnapshot();
        const coReply = await requestLiveCoPilotReply({
          question: clean,
          subject: workspaceCtx.subject,
          language,
          workspaceCtx,
          imageBase64: snap.imageBase64,
          mimeType: snap.mimeType
        });
        setProcessing(false);
        const fullText = coReply.visualPinHint
          ? `${coReply.spokenAnswer} (${coReply.visualPinHint})`
          : coReply.spokenAnswer;
        appendLog({ role: 'os', text: fullText });
        speakFeedback(coReply.spokenAnswer);
        return;
      }

      // 3. Ask Gemini Intent + Q&A Router (strictly clarification-aware)
      setProcessing(true);
      const res = await safeFetchJson<{ success: boolean; plan: VoiceOSActionPlan }>(
        '/api/gemini/voice-os-intent',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ command: clean, language })
        },
        10000
      );
      setProcessing(false);

      if (res.ok && res.data?.plan) {
        const gemPlan = res.data.plan;
        // Guardrail: never let backend teleport to a random monument unless user mentioned monument/number/name
        if (gemPlan.actionType === 'navigate_monument' && clean.split(/\s+/).length < 2) {
          executePlan(buildVoiceClarifyPlan(clean, 'ambiguous'));
          return;
        }
        if (gemPlan.actionType !== 'none') {
          executePlan(gemPlan);
          return;
        }
      }

      // 4. If it reads like a genuine question, answer via local STEM mentor; otherwise politely ask to clarify
      const looksLikeQuestion =
        /(là gì|tại sao|vì sao|giải thích|công thức|định luật|cách|như thế nào|\?|what|why|how|explain)/i.test(
          clean
        );
      if (looksLikeQuestion) {
        const qaFallback = buildLocalVoiceMentorAnswer({
          question: clean,
          modelTitle: workspaceCtx.title || 'Hệ sinh thái Synapse STEM',
          partDescription: res.data?.plan?.replyVi || workspaceCtx.summary,
          formula: workspaceCtx.formula,
          language
        });
        const reply =
          res.ok && res.data?.plan?.replyVi ? res.data.plan.replyVi : qaFallback.spokenAnswer;
        appendLog({ role: 'os', text: reply });
        speakFeedback(reply);
        return;
      }

      executePlan(buildVoiceClarifyPlan(clean, 'ambiguous'));
    },
    [appendLog, executePlan, language, speakFeedback, visionCoPilot, workspaceCtx]
  );

  return {
    logs,
    processing,
    ttsEnabled,
    setTtsEnabled,
    visionCoPilot,
    setVisionCoPilot,
    runCommand,
    clearLogs: () => setLogs([])
  };
}
