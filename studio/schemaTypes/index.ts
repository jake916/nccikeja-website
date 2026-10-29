import { academyCourse } from "./documents/academy-course";
import { academyPage } from "./documents/academy-page";
import { chatMessage } from "./documents/chat-message";
import { connectSubmission } from "./documents/connect-submission";
import { enrolment } from "./documents/enrolment";
import { onlineChurchPage } from "./documents/online-church-page";
import { prayerRequest } from "./documents/prayer-request";
import { event } from "./documents/event";
import { eventRegistration } from "./documents/event-registration";
import { givePage } from "./documents/give-page";
import { homePage } from "./documents/home-page";
import { listingPage } from "./documents/listing-page";
import { publication } from "./documents/publication";
import { sermon } from "./documents/sermon";
import { siteSettings } from "./documents/site-settings";
import { testimony } from "./documents/testimony";
import { testimonyPage } from "./documents/testimony-page";
import { whoWeArePage } from "./documents/who-we-are-page";
import { bankAccount, domiciliaryAccount } from "./objects/bank-account";
import { featuredBank } from "./objects/featured-bank";
import { serviceDay } from "./objects/service-day";
import { socialLinks } from "./objects/social-links";

export const schemaTypes = [
  // Documents
  siteSettings,
  homePage,
  givePage,
  whoWeArePage,
  academyPage,
  onlineChurchPage,
  testimonyPage,
  listingPage,
  event,
  sermon,
  publication,
  academyCourse,
  chatMessage,
  // Form submissions
  enrolment,
  prayerRequest,
  connectSubmission,
  eventRegistration,
  testimony,
  // Objects
  socialLinks,
  serviceDay,
  featuredBank,
  bankAccount,
  domiciliaryAccount,
];
