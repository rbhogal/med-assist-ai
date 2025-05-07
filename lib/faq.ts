const faqs = [
  {
    question: "Where is your address location?",
    answer: "123 Demo St. AI City MA, 99999",
  },
  {
    question: "What are your hours of operation?",
    answer: "Mon-Friday: 9am - 5pm. Sat-Sun: Closed",
  },
  {
    question: "Is there parking?",
    answer: "Yes there is ample parking available.",
  },
  {
    question: "Do you offer tele-health or virtual appointments.",
    answer: "No not at this time.",
  },
  {
    question: "What insurances do you accept?",
    answer: "Most major insurances are accepted. Call us for more details.",
  },
  {
    question: "What is the phone number to the clinic?",
    answer: "Call us at 555-555-5555.",
  },
  {
    question: "How long are wait times?",
    answer: "Wait times on average are about 10 mins.",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Financial services are available. Please contact the clinic for more information at 555-555-5555.",
  },
  {
    question: "How much is an out of pocket visit cost?",
    answer: "$50.00",
  },
  {
    question: "Do you offer payment plans?",
    answer:
      "Financial services are available. Please contact the clinic for more information at 555-555-5555.",
  },
  {
    question: "What are the names of the doctor or doctors at the clinic?",
    answer:
      "We have three doctors on staff. John Doe, M.D., Jane Doe, M.D., and Juan Perez, M.D.  ",
  },
  {
    question: "What services do you offer?",
    answer:
      "Apart from your primary care needs we provide x-rays and blood tests on site.",
  },
  {
    question: "What should I bring to my appointment?",
    answer: "Your ID and insurance card if you have it.",
  },
  {
    question: "How do I get my test results?",
    answer: "Emailed to you in 1-3 days!",
  },
  {
    question: "Can I request a copy of my medical records?",
    answer:
      "Of course! Contact the office phone number at 555-555-5555 we would be happy to help!",
  },
  {
    question: "Do you have COVID protocols?",
    answer:
      "If you have or suspect you have COVID please give us a call beforehand. The doctor will request you wear a mask.",
  },
  {
    question: "Do you accept walk-ins?",
    answer:
      "Yes! Most walk-ins can be accommodated. Please give us a call for more details.",
  },
  {
    question: "I have an emergency, is there a doctor available?",
    answer:
      "If you have an emergency please visit the Emergency Room or call 911. For non-emergency medical attention required outside of clinic hours you may call 777-777-7777.",
  },
  {
    question: "Im late to my appointment is that a problem?",
    answer:
      "Please give us a call ahead if you suspect you are going to be late. For tardiness longer than 20 minutes please reschedule, otherwise we will try to accommodate you.",
  },
  {
    question: "Are you open during holidays?",
    answer: "We closed on federal holidays.",
  },
  {
    question: "Do I get a reminder for my upcoming appointments?",
    answer: "This is just a demo, no.",
  },
  {
    question: "Is your location wheelchair accessible?",
    answer: "Of course!",
  },
  {
    question: "Can I talk to a live person?",
    answer: "Of course! Call us at 555-555-5555.",
  },
  {
    question: "Can I give access to someone to obtain my PHI?",
    answer: "Yes. Please call us at 555-555-5555.",
  },
  {
    question: "Can I just work with a male/female doctor?",
    answer: "Not a problem.",
  },
];

export const FaqSystemPrompt = `
You're a helpful assistant. The user might ask frequently asked questions.
Only answer using the FAQs provided below. Just the answer don't pass along "A:". If the user question doesn't match any FAQ, pass the question along. 

Here are the FAQs:
${faqs
  .map((faq, i) => `${i + 1}. Q: ${faq.question}\nA: ${faq.answer}`)
  .join("\n\n")}
`;
