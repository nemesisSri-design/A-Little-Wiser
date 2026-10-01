type StepProgressProps = {
  currentIndex: number;
  steps: string[];
};

export const StepProgress = ({ currentIndex, steps }: StepProgressProps) => (
  <section aria-label="Session progress" className="session-progress">
    <p className="label">Session progress</p>
    <p>
      Step {currentIndex + 1} of {steps.length}: {steps[currentIndex]}
    </p>
    <ol>
      {steps.map((step, index) => (
        <li key={step} className={index <= currentIndex ? 'done' : ''}>
          {step}
        </li>
      ))}
    </ol>
  </section>
);
