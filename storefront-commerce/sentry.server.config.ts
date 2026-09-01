import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://04c97af024e76d0e99cbf1cd36658b73@o4509446862274560.ingest.us.sentry.io/4511871724290048",
  dataCollection: {},
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,
  integrations: [nodeProfilingIntegration()],
  profileSessionSampleRate: 1.0,
  profileLifecycle: "trace",
});
