import type { Component } from "solid-js";
import { createSignal, createMemo } from "solid-js";

import "./App.scss";

const NOMBER_OF_QUESTIONS = 10;
const numbers = Array.from({ length: NOMBER_OF_QUESTIONS }, (_, i) => i + 1);

interface CircleNumberProps {
  circleNumber: number;
  onNumberClick: (event: Event) => void;
  currentQuestion: () => number;
}

const CircleNumber: Component<CircleNumberProps> = ({
  circleNumber,
  onNumberClick,
  currentQuestion,
}: CircleNumberProps) => {
  // active state if the number is equal or less than the current question
  const isButtonActive = createMemo(() => circleNumber <= currentQuestion());

  return (
    <button
      class={`circle-number flex justify-center align-center ${isButtonActive() ? "active" : ""}
    `}
      onClick={onNumberClick}
      data-question={circleNumber}
    >
      {circleNumber}
    </button>
  );
};

const App: Component = () => {
  const [currentQuestion, setCurrentQuestion] = createSignal(1);

  function handleNumberClick(event: Event) {
    const target = event.target as HTMLButtonElement;
    const questionNumber = parseInt(target.dataset.question || "1", 10);

    setCurrentQuestion(questionNumber);
  }

  return (
    <div class={`App`}>
      <div class={`max-w-800 container`}>
        <h1>Country Quiz</h1>
        <div class='numbers flex'>
          {numbers.map((number) => {
            const buttonProps = {
              circleNumber: number,
              onNumberClick: handleNumberClick,
              currentQuestion,
            };

            return <CircleNumber {...buttonProps} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
