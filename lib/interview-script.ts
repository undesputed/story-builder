export type InterviewLanguage = 'en' | 'ja'

/* Everything the interviewer says, in both languages. The ElevenLabs
   multilingual voice reads whichever language the text is in, so switching
   the script also switches the spoken voice. */
export const SCRIPT = {
  en: {
    greeting:
      "Welcome — I'm your interviewer for New Work Stories. Over a few questions we'll turn the last half year of your work into a story worth keeping.\n\nFirst, the basics: what is your employee ID?",
    employeeId: 'What is your employee ID?',
    employeeName: 'What is your full name?',
    company: 'Which company or team do you work for?',
    role: 'What is your role or job title?',
    periodStart: 'When does this story begin? (e.g., January 2026)',
    periodEnd:
      'And when does it end — or is it ongoing? (e.g., June 2026, or Ongoing)',
    beforeIntro:
      "That's the sheet header done. Now the story itself: what was your work like BEFORE AI — half a year ago? What were you struggling with?",
    before:
      'What was your work like BEFORE AI — half a year ago? Describe the challenge or the old way of working.',
    after:
      'What changed AFTER you started working with AI? What did you do, and how did the work change?',
    afterRepeat:
      'What changed AFTER you started working with AI? Be as concrete as you can.',
    value:
      'Beyond time saved — what true VALUE appeared? For your customers, your team, the company, or yourself?',
    valueRepeat:
      'What true VALUE did this create — for customers, team, company, or yourself?',
    next: "Last one: what's NEXT? What do you want to try in the coming half year — your declaration toward the future.",
    nextRepeat:
      "What's NEXT? What do you want to try in the coming half year?",
    complete:
      'Everything is collected — your sheet is complete. Choose the tone, length, and focus, then generate your story. You can regenerate as often as you like; the facts stay yours.',
    completeAgain:
      'Your answers are already on the sheet. Use "Compose story" to generate a version — or tell me which part you want to revisit.',
    generated: (version: number) =>
      `Version ${version} of your story is on the sheet. If it reads true, confirm and save it. If not, regenerate with different settings — same facts, new telling.`,
    rejected:
      'No problem — adjust the tone, length, or focus and generate again. Or tell me which answer you want to change first.',
    saved:
      'Saved — your story is now in the Museum. Ready for another one?\n\nWhat is your employee ID?',
    editLoaded: (name: string) =>
      `Welcome back${name ? `, ${name}` : ''}. I loaded your saved story onto the sheet. Press "Compose story" to generate a new version, or tell me what you'd like to change.`,
    switchAck: "Sure — let's continue in English.",
    thanks: 'Thank you for sharing your story.',
    inputPlaceholder: 'Type your answer…',
    inputPlaceholderDisabled: 'Paused while you review the sheet…',
    reviewBanner:
      'Your story sheet is ready for review. Confirm & save it, or regenerate — the interview resumes after that.',
    micListening: 'Listening — speak your answer…',
    micLabel: 'Speaking…',
    micBlocked: 'Microphone blocked — allow mic access in your browser.',
    micFailed: 'Voice input failed — try again.',
    micUnsupported: 'Voice input needs Chrome or Edge.',
  },
  ja: {
    greeting:
      'ようこそ。「New Work Stories」のインタビュアーです。いくつかの質問を通して、この半年の仕事を、残す価値のあるものがたりに仕上げていきましょう。\n\nまずは基本情報から。社員IDを教えてください。',
    employeeId: '社員IDを教えてください。',
    employeeName: 'お名前（フルネーム）を教えてください。',
    company: '所属している会社・チームはどちらですか？',
    role: '役職または職種を教えてください。',
    periodStart: 'このものがたりはいつ始まりましたか？（例：2026年1月）',
    periodEnd: 'いつまでの話ですか？継続中でも構いません。（例：2026年6月、または継続中）',
    beforeIntro:
      'シートのヘッダーが完成しました。ここからが本題です。AIを使う前——半年前の仕事はどうでしたか？何に悩んでいましたか？',
    before:
      'AIを使う前——半年前の仕事の様子を教えてください。当時の課題や、以前のやり方はどうでしたか？',
    after:
      'AIと一緒に働き始めてから、何が変わりましたか？何をして、仕事はどう変わりましたか？',
    afterRepeat:
      'AIを使い始めてから何が変わりましたか？できるだけ具体的に教えてください。',
    value:
      '時間の節約だけではなく——どんな本当の価値が生まれましたか？お客様、チーム、会社、あなた自身にとって。',
    valueRepeat:
      'この変化はどんな価値を生みましたか？顧客・チーム・会社・自分自身にとって。',
    next: '最後の質問です。次の半年で、何に挑戦したいですか？未来への宣言をどうぞ。',
    nextRepeat: '次は何をしたいですか？これからの半年での挑戦を教えてください。',
    complete:
      'すべて集まりました——シートが完成しています。トーン・長さ・フォーカスを選んで、ものがたりを生成しましょう。何度でも作り直せます。事実はあなたのものです。',
    completeAgain:
      '回答はすでにシートに載っています。「ものがたりを生成」で新しいバージョンを作るか、修正したい部分を教えてください。',
    generated: (version: number) =>
      `ものがたりのバージョン${version}がシートに載りました。しっくりくれば、確認して保存してください。違うと感じたら、設定を変えて再生成を——同じ事実、新しい語り口で。`,
    rejected:
      'わかりました——トーン・長さ・フォーカスを調整して、もう一度生成しましょう。先に回答を直したい場合は教えてください。',
    saved:
      '保存しました——あなたのものがたりはミュージアムに展示されました。もう一つ、聞かせていただけますか？\n\n社員IDを教えてください。',
    editLoaded: (name: string) =>
      `おかえりなさい${name ? `、${name}さん` : ''}。保存されたものがたりをシートに読み込みました。「ものがたりを生成」で新しいバージョンを作るか、変えたい部分を教えてください。`,
    switchAck: '承知しました。ここからは日本語で続けます。',
    thanks: 'ものがたりを聞かせていただき、ありがとうございました。',
    inputPlaceholder: '回答を入力…',
    inputPlaceholderDisabled: 'シートを確認中はお休みです…',
    reviewBanner:
      'ものがたりシートの確認待ちです。確認して保存するか、再生成してください。その後、インタビューを再開できます。',
    micListening: '聞き取り中——答えを話してください…',
    micLabel: '話しています…',
    micBlocked: 'マイクがブロックされています——ブラウザでマイクを許可してください。',
    micFailed: '音声入力に失敗しました——もう一度お試しください。',
    micUnsupported: '音声入力はChromeまたはEdgeが必要です。',
  },
} satisfies Record<InterviewLanguage, unknown>

export function normalizeLanguage(value: unknown): InterviewLanguage {
  const text = String(value ?? '').toLowerCase()
  return text.startsWith('ja') || text.includes('日本') ? 'ja' : 'en'
}
