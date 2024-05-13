
import congratsImage from '../assets/congrats.svg';
import './FinishCard.scss';

interface FinishCardProps {
    correctAnswers: number;
    totalQuestions: number;
    onPlayAgain: () => void;
}

export default function FinishCard(
    { correctAnswers, totalQuestions, onPlayAgain }: FinishCardProps
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
            You answer {correctAnswers}/{totalQuestions} correctly.
        </p>
        <button class="play-again" onClick={onPlayAgain}>
            Play Again
        </button>
    </div>
  )
}

