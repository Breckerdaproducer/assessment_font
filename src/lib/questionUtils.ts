import { ReactNode } from 'react';

export type QuestionOption =
  | string
  | {
      id?: string;
      label?: string;
      text?: string;
      question_text?: ReactNode;
      is_correct?: boolean;
    };

export const normalizeOption = (option: QuestionOption, index: number) => {
  if (typeof option === 'string') {
    return {
      id: `option-${index}`,
      label: option,
      text: option,
      question_text: option,
      is_correct: false,
    };
  }

  return {
    id: option.id ?? `option-${index}`,
    label: option.label ?? option.text ?? option.question_text ?? '',
    text: option.text ?? option.label ?? option.question_text ?? '',
    question_text: option.question_text ?? option.text ?? option.label ?? '',
    is_correct: option.is_correct ?? false,
  };
};

export const normalizeQuestion = (question: { [key: string]: unknown } | import('@/types').Question) => {
  const rawQuestion = question as Record<string, unknown>;
  const rawOptions = Array.isArray(rawQuestion.options)
    ? (rawQuestion.options as unknown[])
    : [];

  return {
    ...question,
    text:
      typeof rawQuestion.text === 'string'
        ? rawQuestion.text
        : typeof rawQuestion.question_text === 'string'
          ? rawQuestion.question_text
          : '',
    question_text:
      typeof rawQuestion.question_text === 'string'
        ? rawQuestion.question_text
        : typeof rawQuestion.text === 'string'
          ? rawQuestion.text
          : '',
    options: rawOptions.map((option, index) => normalizeOption(option as QuestionOption, index)),
    correctOption:
      typeof rawQuestion.correctOption === 'number'
        ? rawQuestion.correctOption
        : typeof rawQuestion.correct_option === 'number'
          ? rawQuestion.correct_option
          : 0,
  } as import('@/types').Question;
};
