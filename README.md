# A Little Wiser

A Little Wiser is a scholarly daily learning site built for a focused 10–15 minute reading session each day. Each lesson combines one idea from the history of thought, vocabulary study, short recall practice, and a written reflection.

## Stack

- React + TypeScript + Vite
- React Router for page navigation
- Static JSON content in `src/content/lessons/`
- Local-only persistence using `localStorage` through `src/lib/storage.ts`

## Daily session flow

The **Today** page runs a guided sequence with progress visibility:

1. Review due vocabulary (spaced repetition at 1, 3, 7, and 21 day intervals)
2. Concept reading
3. Primary-source passage with citation
4. Vocabulary (three words)
5. Quiz (free recall first, optional multiple-choice fallback)
6. Reflection writing
7. Completion summary

Daily lesson selection is date-based: days since a fixed start date, modulo lesson count.

## Pages

- **Today**
- **Commonplace Book** (search + export to Markdown/JSON)
- **Lexicon**
- **Map** (SVG concept graph)
- **Progress**
- **Archive**

## Run locally

```bash
npm install
npm run dev
```

Other checks:

```bash
npm run test
npm run lint
npm run build
```

## Add a lesson

Create a file in `src/content/lessons/` named like `006-stoicism.json`:

```json
{
  "id": "006-stoicism",
  "title": "Lesson title",
  "tradition": "Tradition",
  "concept": "~350 words of exact prose",
  "source": {
    "text": "Short passage",
    "author": "Author",
    "work": "Work",
    "translator": "Translator"
  },
  "words": [
    { "word": "", "meaning": "", "etymology": "", "example": "" },
    { "word": "", "meaning": "", "etymology": "", "example": "" },
    { "word": "", "meaning": "", "etymology": "", "example": "" }
  ],
  "quiz": [
    { "question": "", "answer": "" },
    { "question": "", "answer": "", "options": ["", "", "", ""] },
    { "question": "", "answer": "" },
    { "question": "", "answer": "", "options": ["", "", "", ""] }
  ],
  "reflection": "Prompt",
  "related": ["ids-of-earlier-lessons"]
}
```

Lessons are validated at load time. Malformed JSON raises a clear error during development.

## Content standards

- Calm, exact prose without hype
- Strongest argument and strongest objection both included
- Primary-source excerpt must be public domain, including translation
- Vocabulary should be useful and etymologically grounded
- `related` links should reflect real conceptual relationships

## Licensing

- Code is licensed under **MIT** (see `LICENSE`)
- Content in `src/content/lessons/` is licensed separately under **CC BY-NC-SA 4.0**
