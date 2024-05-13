
import congratsImage from '../assets/congrats.svg';
import './FinishCard.scss';

import { NUMBER_OF_QUESTIONS } from '../constants';

interface FinishCardProps {
    correctAnswers: number;
    onPlayAgain: () => void;
}

export default function FinishCard(
    { correctAnswers, onPlayAgain }: FinishCardProps
) {
  return (
    <div class="finish-card">
        <div class="image-container">
            <img src={congratsImage} alt="Congrats" />
        </div>
        <p class="main-message">
            Congrats! You finished the quiz.
        </p>
        <p class="sub-message">
            You answer {correctAnswers}/{NUMBER_OF_QUESTIONS} correctly.
        </p>
        <button class="play-again" onClick={onPlayAgain}>
            Play Again
        </button>
    </div>
  )
}

