const CALENDLY_ACCESS_TOKEN = process.env.CALENDLY_ACCESS_TOKEN;

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
};
