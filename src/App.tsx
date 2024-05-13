import type { Component } from "solid-js";
import {
  For,
  createSignal,
  createEffect,
  createMemo,
  createResource,
  Show,
  Suspense,
} from "solid-js";
import Axios from "axios";

import Question from "./components/Question";
import FinishCard from "./components/FinishCard";
import { Country, QuestionType } from "./types";
import { getQuestions } from "./utils";

import "./App.scss";
import Loader from "./components/Loader";

const baseCountryUrl = "https://restcountries.com/v3.1/";
const NOMBER_OF_QUESTIONS = 10;
const numbers = Array.from({ length: NOMBER_OF_QUESTIONS }, (_, i) => i + 1);

const fetchCountries = async () => {
  try {
    const response = await Axios.get<Country[]>(`${baseCountryUrl}all`);

    if (response.status !== 200) {
      throw new Error("Error while fetching countries");
    }

    return response.data;
  } catch (error) {
    console.error("Error while fetching countries: ", error);
    throw error;
  }
};

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
      class={`circle-number flex justify-center align-center ${
        isButtonActive() ? "active" : ""
      }
    `}
      onClick={onNumberClick}
      data-question={circleNumber}
    >
      {circleNumber}
    </button>
  );
};

const App: Component = () => {
  const [countries] = createResource(fetchCountries);
  const [currentQuestion, setCurrentQuestion] = createSignal(1);
  const [questions, setQuestions] = createSignal<QuestionType[]>([]);
  const [isGameFinished, setIsGameFinished] = createSignal(true);

  function handleNumberClick(event: Event) {
    const target = event.target as HTMLButtonElement;
    const questionNumber = parseInt(target.dataset.question || "1", 10);

    setCurrentQuestion(questionNumber);
  }

  createEffect(() => {
    if (
      !countries.loading &&
      !countries.error &&
      countries() &&
      countries()!.length > 0
    ) {
      const questionsData = getQuestions(countries()!, NOMBER_OF_QUESTIONS);
      setQuestions(questionsData);
    }
  });

  return (
    <div class={`App`}>
      <div class={`max-w-800 container`}>
        <Show when={!isGameFinished()}>
          <div class='wrapper'>
            <h1>Country Quiz</h1>
            <div class='numbers flex'>
              <For each={numbers}>
                {(number) => {
                  const buttonProps = {
                    circleNumber: number,
                    onNumberClick: handleNumberClick,
                    currentQuestion,
                  };

                  return <CircleNumber {...buttonProps} />;
                }}
              </For>
            </div>
            <Suspense fallback={<Loader />}>
              <Show when={!countries.loading && !countries.error}>
                {questions().map((question, index) => {
                  return (
                    <Show when={index + 1 === currentQuestion()}>
                      <Question question={question} />
                    </Show>
                  );
                })}
              </Show>
              <Show when={countries.error}>
                <p style={{ color: "red", "margin-block-start": "2rem" }}>
                  Error while getting countries data: {countries.error.message}
                </p>
              </Show>
            </Suspense>
          </div>
        </Show>
        <Show when={isGameFinished()}>
          <FinishCard />
        </Show>
      </div>
    </div>
  );
};

export default App;
