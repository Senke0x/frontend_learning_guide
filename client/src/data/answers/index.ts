import type { AllAnswers } from '../answersTypes';
import { day0Answers } from './day0Answers';
import { day1Answers } from './day1Answers';
import { day2Answers } from './day2Answers';
import { day3Answers } from './day3Answers';
import { day4Answers } from './day4Answers';
import { day5Answers } from './day5Answers';
import { day6Answers } from './day6Answers';
import { day7Answers } from './day7Answers';

export const allAnswers: AllAnswers = [
  day0Answers,
  day1Answers,
  day2Answers,
  day3Answers,
  day4Answers,
  day5Answers,
  day6Answers,
  day7Answers,
];

export const answersByDay = Object.fromEntries(
  allAnswers.map((item) => [item.day, item])
);
