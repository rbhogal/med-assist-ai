const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;

const faqs = [
  {
    question: "Where is your address location?",
    answer: "123 Demo St. AI City, MA",
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
      "Financial services are available. Please contact the clinic for more information.",
  },
  {
    question: "What are the names of the doctor or doctors at the clinic?",
    answer:
      "We have three doctors on staff. John Doe, M.D., Jane Doe, M.D., and Juan Perez, M.D.  ",
  },
  {
    question: "What services do you offer?",
    answer:
      "Apart from your primary care needs we provide x-rays and blood tests on site",
  },
  {
    question: "What should I bring to my appointment?",
    answer: "Your ID, and insurance card or information if you have it.",
  },
  {
    question: "How do I get my test results?",
    answer: "Emailed to you in 1-3 days.",
  },
  {
    question: "Can I request a copy of my medical records?",
    answer: "Of course! Contact the office phone number.",
  },
  {
    question: "Do you have COVID protocols?",
    answer:
      "If you have or suspect you have COVID please give us a call beforehand. The doctor will request you wear a mask.",
  },
  {
    question: "Do you accept walk-ins?",
    answer:
      "Yes! Most walk-ins can be accommodated. Please give us a call to know more.",
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
];

const FaqSystemPrompt = `
You're a helpful assistant. The user might ask frequently asked questions.
Only answer using the FAQs provided below. Just the answer don't pass along "A:". If the user question doesn't match any FAQ, pass the question along. 

Here are the FAQs:
${faqs
  .map((faq, i) => `${i + 1}. Q: ${faq.question}\nA: ${faq.answer}`)
  .join("\n\n")}
`;

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${CALENDLY_ACCESS_TOKEN}`,
  },
};

const getCalendlyCurrentUserOrg = async () => {
  const response = await fetch("https://api.calendly.com/users/me", options);
  if (!response.ok) {
    throw new Error("Failed to get Calendly current organization");
  }

  const data = await response.json();

  return data.resource.current_organization;
};

const getCalendlyEventTypes = async (organizationUri: string) => {
  const baseUrl = "https://api.calendly.com/event_types";
  const url = `${baseUrl}?organization=${encodeURIComponent(organizationUri)}`;

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error("Failed to get Calendly event types");
  }

  const data = await response.json();
  return data.collection[0].uri;
};

const createCalendlyInvite = async (eventTypesUri: string) => {
  const response = await fetch("https://api.calendly.com/scheduling_links", {
    ...options,
    method: "POST",
    body: JSON.stringify({
      max_event_count: 1,
      owner: eventTypesUri,
      owner_type: "EventType",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.log("\x1b[37m\x1b[41m%s\x1b[0m", "ERROR:", errorText);
    throw new Error("Failed to create Calendly invite link");
  }

  const data = await response.json();
  return data.resource.booking_url;
};

const handleCalendlyBooking = async (): Promise<string> => {
  const org = await getCalendlyCurrentUserOrg();
  const eventType = await getCalendlyEventTypes(org);
  return await createCalendlyInvite(eventType);
};

export {
  getCalendlyCurrentUserOrg,
  getCalendlyEventTypes,
  createCalendlyInvite,
  handleCalendlyBooking,
  FaqSystemPrompt,
};
