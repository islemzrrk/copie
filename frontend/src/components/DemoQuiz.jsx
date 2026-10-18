import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { QUESTIONS, TOTAL_SECONDS } from '../lib/demoQuiz';
import { Check, Cross } from './Marks';

const LAST = QUESTIONS.length - 1;
const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function isCorrect(q, answer) {
  if (q.type === 'multiple') {
    const a = [...(answer || [])].sort();
    const c = [...q.correct].sort();
    return a.length === c.length && a.every((v, i) => v === c[i]);
  }
  if (q.type === 'short') return q.accepted.includes((answer || '').trim().toLowerCase());
  return answer === q.correct;
}

function hasAnswer(q, answer) {
  if (q.type === 'multiple') return (answer || []).length > 0;
  if (q.type === 'short') return Boolean((answer || '').trim());
  return Boolean(answer);
}

function correctLabel(q) {
  if (q.type === 'short') return q.display;
  const ids = q.type === 'multiple' ? q.correct : [q.correct];
  return q.options.filter((o) => ids.includes(o.id)).map((o) => o.label).join(', ');
}

export default function DemoQuiz() {
  const [phase, setPhase] = useState('intro'); // intro | play | done
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [locked, setLocked] = useState(false);
  const [seconds, setSeconds] = useState(TOTAL_SECONDS);

  // Minuteur : à zéro, la copie est rendue automatiquement.
  useEffect(() => {
    if (phase !== 'play') return;
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'play' && seconds === 0) setPhase('done');
  }, [phase, seconds]);

  const start = () => {
    setAnswers({});
    setIndex(0);
    setLocked(false);
    setSeconds(TOTAL_SECONDS);
    setPhase('play');
  };

  const q = QUESTIONS[index];
  const answer = answers[q.id];
  const setAnswer = (value) => setAnswers((a) => ({ ...a, [q.id]: value }));
  const toggle = (id) => {
    const current = answer || [];
    setAnswer(current.includes(id) ? current.filter((x) => x !== id) : [...current, id]);
  };
  const next = () => {
    if (index === LAST) return setPhase('done');
    setIndex((i) => i + 1);
    setLocked(false);
  };

  const score = QUESTIONS.filter((x) => isCorrect(x, answers[x.id])).length;
  const urgent = seconds <= 15;

  return (
    <section aria-label="Quiz d’essai" className="sheet drop-in min-h-[27rem] py-8 pl-12 pr-5 sm:pl-[76px] sm:pr-8">
      {phase === 'intro' && (
        <div>
          <p className="font-hand text-3xl text-pen">Copie d’essai</p>
          <h2 className="mt-1 text-2xl font-extrabold leading-tight">Quatre questions, quatre formats.</h2>
          <p className="mt-3 text-ink-soft">
            QCM à choix unique, QCM à choix multiples, vrai ou faux, réponse courte. Le minuteur démarre au
            premier clic ; à zéro, la copie est rendue automatiquement.
          </p>
          <button type="button" className="btn btn-primary mt-6" onClick={start}>
            Commencer le quiz
          </button>
        </div>
      )}

      {phase === 'play' && (
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="font-hand text-2xl text-pen">Question {index + 1} sur {QUESTIONS.length}</p>
            <p role="timer" className={`font-bold tabular-nums ${urgent ? 'text-pen' : ''}`}>{formatTime(seconds)}</p>
          </div>
          <div className="mt-1 h-1.5 rounded bg-line/60" aria-hidden="true">
            <div
              className={`h-full rounded transition-[width] duration-1000 ease-linear ${urgent ? 'bg-pen' : 'bg-ink'}`}
              style={{ width: `${(seconds / TOTAL_SECONDS) * 100}%` }}
            />
          </div>

          <p className="mt-5 text-sm text-ink-soft">{q.kind}</p>
          <fieldset>
            <legend className="mt-1 text-xl font-bold leading-snug">{q.text}</legend>

            {q.type === 'short' ? (
              <div className="mt-5">
                <label htmlFor="short-answer" className="sr-only">Votre réponse</label>
                <input
                  id="short-answer"
                  className="input"
                  value={answer || ''}
                  disabled={locked}
                  placeholder="Écrivez votre réponse"
                  autoComplete="off"
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !locked && hasAnswer(q, answer)) setLocked(true);
                  }}
                />
                {locked && <p className="mt-2 font-hand text-2xl text-ok">Réponse attendue : {q.display}</p>}
              </div>
            ) : (
              <div className="mt-4 grid gap-1.5">
                {q.options.map((o) => {
                  const multiple = q.type === 'multiple';
                  const on = multiple ? (answer || []).includes(o.id) : answer === o.id;
                  const right = multiple ? q.correct.includes(o.id) : q.correct === o.id;
                  return (
                    <label
                      key={o.id}
                      className={`flex items-center gap-3 rounded px-2 py-2 ${locked ? '' : 'cursor-pointer hover:bg-mark/40'} ${locked && right ? 'marker' : ''}`}
                    >
                      <input
                        type={multiple ? 'checkbox' : 'radio'}
                        name={q.id}
                        className="sr-only"
                        checked={on}
                        disabled={locked}
                        onChange={() => (multiple ? toggle(o.id) : setAnswer(o.id))}
                      />
                      <span className={`bubble ${multiple ? 'square' : ''}`} data-on={on} aria-hidden="true" />
                      <span className={locked && on && !right ? 'line-through decoration-pen decoration-2' : ''}>{o.label}</span>
                      {locked && right && (
                        <>
                          <Check className="ml-auto h-5 w-5 text-ok" />
                          <span className="sr-only">Bonne réponse</span>
                        </>
                      )}
                      {locked && on && !right && (
                        <>
                          <Cross className="ml-auto h-5 w-5 text-pen" />
                          <span className="sr-only">Réponse incorrecte</span>
                        </>
                      )}
                    </label>
                  );
                })}
              </div>
            )}
          </fieldset>

          <div className="mt-5 min-h-[5.5rem]" aria-live="polite">
            {locked && (
              <>
                <p className={`font-hand text-3xl ${isCorrect(q, answer) ? 'text-ok' : 'text-pen'}`}>
                  {isCorrect(q, answer) ? 'Correct !' : 'Raté.'}
                </p>
                <p className="text-sm text-ink-soft">{q.explanation}</p>
              </>
            )}
          </div>

          {locked ? (
            <button type="button" className="btn btn-primary" onClick={next}>
              {index === LAST ? 'Voir ma note' : 'Question suivante'}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled={!hasAnswer(q, answer)} onClick={() => setLocked(true)}>
              Valider
            </button>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div aria-live="polite">
          {seconds === 0 && <p className="text-sm font-semibold text-pen">Temps écoulé : la copie a été rendue automatiquement.</p>}
          <p className="font-hand text-2xl text-ink-soft">Votre note</p>
          <div className="relative mt-1 h-24 w-48">
            <svg className="absolute inset-0 h-full w-full text-pen" viewBox="0 0 200 100" fill="none" aria-hidden="true">
              <ellipse className="draw-long" cx="100" cy="50" rx="94" ry="43" stroke="currentColor" strokeWidth="3" strokeLinecap="round" transform="rotate(-6 100 50)" />
            </svg>
            <p className="absolute inset-0 grid -rotate-6 place-items-center font-hand text-7xl font-bold text-pen">
              {score}/{QUESTIONS.length}
            </p>
          </div>
          <p className="mt-3 font-semibold">
            {score >= 3 ? 'Bien joué.' : 'Relisez les corrections ci-dessous, puis réessayez.'}
          </p>

          <ul className="mt-4 grid gap-2 text-sm">
            {QUESTIONS.map((x) => {
              const ok = isCorrect(x, answers[x.id]);
              return (
                <li key={x.id} className="flex items-start gap-2">
                  {ok ? <Check className="mt-0.5 h-5 w-5 shrink-0 text-ok" /> : <Cross className="mt-0.5 h-5 w-5 shrink-0 text-pen" />}
                  <span>
                    <span className="sr-only">{ok ? 'Juste. ' : 'Faux. '}</span>
                    <span className="font-semibold">{x.kind} :</span> {correctLabel(x)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={start}>Recommencer</button>
            <Link to="/register" className="btn btn-primary">Créer un compte</Link>
          </div>
        </div>
      )}
    </section>
  );
}
