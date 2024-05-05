import { Country } from '../types';
import './Question.scss';

import { getQuestionFromCountry } from '../utils';

interface QuestionProps {
    country: Country;
}

export default function Question(
    { country }: QuestionProps
) {

    const countryQuestion = getQuestionFromCountry(country, [], 'capital');

    return (
        <div class="question">
            <h2>What is the capital of {country?.name.common}?</h2>
        </div>
    )
}