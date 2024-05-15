import { createSignal, Setter } from "solid-js";
import toast from "solid-toast";

import { QuestionType } from "../types";
import { durationBetweenQuestions } from "../constants";
import "./Question.scss";

import correctIocn from "../assets/Check_round_fill.svg";
import wrongIcon from "../assets/Close_round_fill.svg";

interface QuestionOptionProps {
  option: string;
  onClick: (event: Event) => void;
  showCorrect: () => boolean;
  correctAnswer: string;
  selectedOption: () => string;
}

function QuestionOption({
  option,
  onClick,
  showCorrect,
  correctAnswer,
  selectedOption,
}: QuestionOptionProps) {
  const isThisCorrect = option === correctAnswer;

  return (
    <button
      class={`option ${selectedOption() == option ? "selected" : ""}`}
      onClick={onClick}
      data-option={option}
    >
      {option}{" "}
      {showCorrect() && isThisCorrect ? (
        <img class='correct-icon' src={correctIocn} alt='correct' />
      ) : (
        ""
      )}
      {showCorrect() && !isThisCorrect && selectedOption() === option ? (
        <img class='wrong-icon' src={wrongIcon} alt='wrong' />
      ) : (
        ""
      )}
    </button>
  );
}

interface QuestionProps {
  question: QuestionType;
  questionIndex: number;
  setCorrectAnswers: Setter<number>;
  setCurrentQuestion: Setter<number>;
  setIsGameFinished: (isGameFinished: boolean) => void;
}

export default function Question({
  question,
  questionIndex,
  setCorrectAnswers,
  setCurrentQuestion,
  setIsGameFinished,
}: QuestionProps) {
  const [showCorrect, setShowCorrect] = createSignal(false);
  const [selectedOption, setSelectedOption] = createSignal("");

  const correctAnswer = question.correctAnswer;

  const onOptionClick = (event: Event) => {
    const optionString = (event.target as HTMLButtonElement).dataset.option;
    setSelectedOption(optionString as string);
    setShowCorrect(true);

    if (optionString === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);

      if (questionIndex === 9) {
        setIsGameFinished(true);
      } else {
        toast.success("Correct Answer! Next Question...", {
          duration: durationBetweenQuestions,
          position: "top-right",
          ariaProps: { role: "alert", "aria-live": "assertive" },
        });

        setTimeout(() => {
          setCurrentQuestion((prev) => prev + 1);
          setShowCorrect(false);
          setSelectedOption("");
        }, durationBetweenQuestions);
      }
    } else {
      toast.error("Wrong Answer :(", {
        duration: durationBetweenQuestions,
        position: "top-right",
      });

      setTimeout(() => {
        setShowCorrect(false);
        setSelectedOption("");
        // finish the game
        setIsGameFinished(true);
      }, durationBetweenQuestions);
    }
  };

  return (
    <div class='question'>
      <div class='main-question'>
        {question.type === "capital" ? (
          <p class='capital-question'>
            Which country is {question.countryCapital} the capital?
          </p>
        ) : (
          <div class='flag-question flex-wrap'>
            Which country does this flag{" "}
            <img src={question.flagUrl} alt='country flag' /> belong to?
          </div>
        )}
      </div>
      <div class='options'>
        {question.options.map((option) => {
          return (
            <QuestionOption
              option={option}
              onClick={onOptionClick}
              showCorrect={showCorrect}
              correctAnswer={correctAnswer}
              selectedOption={selectedOption}
            />
          );
        })}
      </div>
    </div>
  );
}
