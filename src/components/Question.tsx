import { createSignal } from 'solid-js';
import { QuestionType } from '../types';
import './Question.scss';

import correctIocn from '../assets/Check_round_fill.svg';
import wrongIcon from '../assets/Close_round_fill.svg';

interface QuestionOptionProps {
    option: string;
    onClick: (event: Event) => void;
    showCorrect: () => boolean;
    correctAnswer: string;
    selectedOption: () => string;
}

function QuestionOption(
    { option, onClick, showCorrect, correctAnswer, selectedOption}: QuestionOptionProps
) {

    const isThisCorrect = option === correctAnswer;

    return (
        <button 
            class={`option ${selectedOption() == option ? 'selected': ''}`}
            onClick={onClick}
        >
            {option} {showCorrect() && isThisCorrect ? <img 
                class="correct-icon" 
                src={correctIocn}
                alt="correct" /> : ""}
            {showCorrect() && !isThisCorrect && selectedOption() === option ? <img 
                class="wrong-icon" 
                src={wrongIcon} 
                alt="wrong" /> : ""}
        </button>
    )
}

interface QuestionProps {
    question: QuestionType;
}

export default function Question(
    { question }: QuestionProps
) {

    const [showCorrect, setShowCorrect] = createSignal(false);
    const [selectedOption, setSelectedOption] = createSignal("");

    const correctAnswer = question.correctAnswer;

    const onOptionClick = (event: Event) => {
        const optionString = (event.target as HTMLButtonElement).innerText;
        setSelectedOption(optionString);
        setShowCorrect(true);
    }

    return (
        <div class="question"
        >
                <div class='main-question'>
                    {question.type === "capital" ? <p class='capital-question'>Which conutry is {question.countryCapital} the capital?</p>:<div class='flag-question'>
                            Which country does this flag <img src={question.flagUrl} alt="country flag" /> belong to?
                        </div>}
                </div>
                <div class="options">
                    {question.options.map((option) => {
                        return <QuestionOption option={option}
                            onClick={onOptionClick}
                            showCorrect={showCorrect}
                            correctAnswer={correctAnswer}
                            selectedOption={selectedOption}
                        />
                    })}
                </div>
        </div>
    )
}