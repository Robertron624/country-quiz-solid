import { QuestionType } from '../types';
import './Question.scss';

interface QuestionOptionProps {
    option: string;
}

function QuestionOption(
    { option }: QuestionOptionProps
) {
    return (
        <div class="question-option">
            {option}
        </div>
    )
}

interface QuestionProps {
    question: QuestionType;
}

export default function Question(
    { question }: QuestionProps
) {

    console.log("question received", question);

    return (
        <div class="question"
        >
                <div class='main-question'>
                    {question.type === "capital" ? <p class='capital-question'>Which conutry is {question.countryCapital} the capital?</p>:<div class='flag-question'>
                            Which country does this flag <img src={question.flagUrl} alt="country flag" /> belong to?
                        </div>}
                </div>
        </div>
    )
}