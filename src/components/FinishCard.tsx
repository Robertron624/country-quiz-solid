
import congratsImage from '../assets/congrats.svg';
import './FinishCard.scss';

export default function FinishCard() {
  return (
    <div class="finish-card">
        <div class="image-container">
            <img src={congratsImage} alt="Congrats" />
        </div>
        <p class="main-message">
            Congrats! You finished the quiz.
        </p>
        <p class="sub-message">
            You answer 4/10 correctly.
        </p>
        <button class="play-again">
            Play Again
        </button>
    </div>
  )
}

