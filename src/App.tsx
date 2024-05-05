import type { Component } from "solid-js";
import {For, createSignal, createEffect, createMemo, createResource, Switch, Match, Show, onCleanup, Suspense} from "solid-js";
import Axios from "axios";

import Question from "./components/Question";
import { Country, QuestionType } from "./types";
import { getQuestions, shuffleArray } from "./utils";

import "./App.scss";
import Loader from "./components/Loader";

const baseCountryUrl = "https://restcountries.com/v3.1/";
const NOMBER_OF_QUESTIONS = 10;
const numbers = Array.from({ length: NOMBER_OF_QUESTIONS }, (_, i) => i + 1);

const fetchCountries = async () => {
  const response = await Axios.get<Country[]>(`${baseCountryUrl}all`);
  return response.data;
}

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

  const [countries] = createResource(fetchCountries);
  const [currentQuestion, setCurrentQuestion] = createSignal(1);
  let randomCountries: Country[] = [];


  function handleNumberClick(event: Event) {
    const target = event.target as HTMLButtonElement;
    const questionNumber = parseInt(target.dataset.question || "1", 10);

    setCurrentQuestion(questionNumber);
  }

  createEffect(() => {
    let isFetching = true;

    const fetchCountriesData = async () => {
      const countriesData = await fetchCountries();
      randomCountries = shuffleArray(countriesData).slice(0, NOMBER_OF_QUESTIONS);
      isFetching = false;
    };

    fetchCountriesData();

    onCleanup(() => {
      // Cleanup if the component is unmounted before data is fetched
      isFetching = false;
    });
  });

  return (
    <div class={`App`}>
      <div class={`max-w-800 container`}>
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
            <Switch>
              <Match when={countries() !== undefined}> {/* Match when, is not recognized by typescript */}
                <div class="questions-container">
                  <For each={shuffleArray(countries()!).slice(0, NOMBER_OF_QUESTIONS)}>
                    {(country) => <Question country={country} />}
                  </For>
                </div>
              </Match>
              <Match when={countries.error}>
                <div>Error fetching data</div>
              </Match>
            </Switch>
          </Show>
        </Suspense>
      </div>
    </div>
  );
};

export default App;
