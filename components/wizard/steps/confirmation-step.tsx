interface ConfirmationStepProps {
  url: string | undefined;
}

export const ConfirmationStep = ({ url }: ConfirmationStepProps) => {
  return (
    <div className="flex flex-col">
      <p>{`We've booked your appointment, you're all set. See you soon!`}</p>
      <p className="pt-6">
        <a
          className="text-blue-500  hover:text-blue-600 font-semibold"
          target="_blank"
          rel="noopener noreferrer"
          href={url}
        >
          Click here to add the appointment to your google calender
        </a>
      </p>
    </div>
  );
};
