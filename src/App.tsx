import type { Component } from "solid-js";
import { Toaster } from "solid-toast";
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

import "./App.scss";

import Question from "./components/Question";
import FinishCard from "./components/FinishCard";
import Loader from "./components/Loader";

import { Country, QuestionType } from "./types";
import { getQuestions, shuffleArray } from "./utils";
import { NUMBER_OF_QUESTIONS } from "./constants";

const baseCountryUrl = "https://restcountries.com/v3.1/";
const numbers = Array.from({ length: NUMBER_OF_QUESTIONS }, (_, i) => i + 1);

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
  const [isGameFinished, setIsGameFinished] = createSignal(false);
  const [correctAnswers, setCorrectAnswers] = createSignal(0);

  function handleNumberClick(event: Event) {
    const target = event.target as HTMLButtonElement;
    const questionNumber = parseInt(target.dataset.question || "1", 10);

    setCurrentQuestion(questionNumber);
  }

  function getNewQuestions() {
    const currentCountries = countries() || [];
    const shuffledCountries = shuffleArray(currentCountries);
    const questionsData = getQuestions(shuffledCountries, NUMBER_OF_QUESTIONS);
    setQuestions(questionsData);
  }

  function onPlayAgain() {
    setIsGameFinished(false);
    setCurrentQuestion(1);
    setCorrectAnswers(0);
    getNewQuestions();
  }

  createEffect(() => {
    if (
      !countries.loading &&
      !countries.error &&
      countries() &&
      countries()!.length > 0
    ) {
      const questionsData = getQuestions(countries()!, NUMBER_OF_QUESTIONS);
      setQuestions(questionsData);
    }
  });

  return (
    <div class={`App`}>
      <Toaster />
      <div class={`max-w-800 container`}>
        <Show when={!isGameFinished()}>
          <div class='wrapper'>
            <h1>Country Quiz</h1>
            <div class='numbers flex flex-wrap'>
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
                      <Question 
                        question={question} 
                        questionIndex={index}
                        setCorrectAnswers={setCorrectAnswers}
                        setCurrentQuestion={setCurrentQuestion}
                        setIsGameFinished={setIsGameFinished}
                      />
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
          <FinishCard 
            correctAnswers={correctAnswers()} 
            onPlayAgain={onPlayAgain}
          />
        </Show>
      </div>
    </div>
  );
};

export default App;
