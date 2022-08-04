/**
 * This is the entrypoint file of the application. It communicates the
 * important features of this microfrontend to the app shell. It
 * connects the app shell to the React application(s) that make up this
 * microfrontend.
 */

import {
  getAsyncLifecycle,
  defineConfigSchema,
  provide,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import ugandaEmrOverrides from "./ugandaemr-configuration-overrrides.json";
import ugandaEmrConfig from "./ugandaemr-config";
import formsRegistry from "./forms/forms-registry";
import { addToBaseFormsRegistry } from "@ohri/openmrs-ohri-form-engine-lib";
import {
  createDashboardGroup,
  createDashboardLink,
} from "@openmrs/esm-patient-common-lib";
import {
  ancDashboardMeta,
  eidDashboardMeta,
  mchDashboardMeta,
  pncDashboardMeta,
  maternityMetaData,
  opdDashboardMeta,
  familyhealthDashboardMeta,
  childHealthDashboardMeta,
  outpatientDashboardMeta,
  referralNoteDashboardMeta,
} from "./ugandaemr-dashboard";

/**
 * This tells the app shell how to obtain translation files: that they
 * are JSON files in the directory `../translations` (which you should
 * see in the directory structure).
 */
const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

/**
 * This tells the app shell what versions of what OpenMRS backend modules
 * are expected. Warnings will appear if suitable modules are not
 * installed. The keys are the part of the module name after
 * `openmrs-module-`; e.g., `openmrs-module-fhir2` becomes `fhir2`.
 */
const backendDependencies = {
  fhir2: "^1.2.0",
  "webservices.rest": "^2.2.0",
};

/**
 * This function performs any setup that should happen at microfrontend
 * load-time (such as defining the config schema) and then returns an
 * object which describes how the React application(s) should be
 * rendered.
 *
 * In this example, our return object contains a single page definition.
 * It tells the app shell that the default export of `greeter.tsx`
 * should be rendered when the route matches `hello`. The full route
 * will be `openmrsSpaBase() + 'hello'`, which is usually
 * `/openmrs/spa/hello`.
 */
function setupOpenMRS() {
  const moduleName = "@ugandaemr/esm-ugandaemr-app";

  const options = {
    featureName: "UgandaEMR",
    moduleName,
  };

  defineConfigSchema(moduleName, configSchema);
  provide(ugandaEmrOverrides);
  provide(ugandaEmrConfig);
  addToBaseFormsRegistry(formsRegistry);
  return {
    pages: [],
    extensions: [
      //add opd slot onto patient chart dashboard
      {
        id: "opd-dashboard",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(createDashboardGroup(opdDashboardMeta), options),
        meta: opdDashboardMeta,
      },
      //add outpatient slot onto opd dashboard
      {
        id: "outpatient-dashboard",
        slot: "opd-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(outpatientDashboardMeta),
          options
        ),
        meta: outpatientDashboardMeta,
      },
      //add outpatient action to open a component
      {
        id: "outpatient-ext",
        slot: "outpatient-dashboard-slot1",
        load: getAsyncLifecycle(
          () => import("./pages/opd/outpatient-register.component"),
          {
            featureName: "outpatient-extension",
            moduleName,
          }
        ),
      },
      //add referral note slot onto opd dashboard
      {
        id: "referral-note-dashboard",
        slot: "opd-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(referralNoteDashboardMeta),
          options
        ),
        meta: referralNoteDashboardMeta,
      },
      //add referral note action to open a component
      {
        id: "referral-note-ext",
        slot: "referral-note-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./pages/opd/referral-note.component"),
          {
            featureName: "referral-note-extension",
            moduleName,
          }
        ),
      },
      {
        id: "cervical-cancer-summary-ext",
        slot: "cacx-visits-slot",
        load: getAsyncLifecycle(
          () =>
            import("./pages/cervical-cancer/cacx-visits/cacx-visits.component"),
          {
            featureName: "cervical-cancer-summary-extension",
            moduleName,
          }
        ),
      },
      {
        id: "family-health-clinic-dashboard",
        slot: "patient-chart-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardGroup(familyhealthDashboardMeta),
          options
        ),
        meta: familyhealthDashboardMeta,
      },
      //add MCH slot onto Family Health dashboard
      {
        id: "mch-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(createDashboardGroup(mchDashboardMeta), options),
        meta: mchDashboardMeta,
      },

      //add Child Health slot onto Family Health dashboard
      {
        id: "child-health-dashboard",
        slot: "family-health-dashboard-slot",
        load: getSyncLifecycle(
          createDashboardLink(childHealthDashboardMeta),
          options
        ),
        meta: childHealthDashboardMeta,
      },
      //add Child Health action to open a component
      {
        id: "child-health-summary-ext",
        slot: "child-health-dashboard-slot",
        load: getAsyncLifecycle(
          () => import("./pages/family-health-clinic/child-health.component"),
          {
            featureName: "child-health-extension",
            moduleName,
          }
        ),
      },

      //add PNC slot onto MCH dashboard
      {
        id: "pnc-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(pncDashboardMeta), options),
        meta: pncDashboardMeta,
      },
      //add PNC action to open a component
      {
        id: "pnc-summary-ext",
        slot: "pnc-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import("./pages/family-health-clinic/mch/pnc-register.component"),
          {
            featureName: "pnc-extension",
            moduleName,
          }
        ),
      },
      //add ANC slot onto MCH dashboard
      {
        id: "anc-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(ancDashboardMeta), options),
        meta: ancDashboardMeta,
      },
      //add ANC action to open a component
      {
        id: "anc-summary-ext",
        slot: "anc-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import("./pages/family-health-clinic/mch/anc-register.component"),
          {
            featureName: "anc-extension",
            moduleName,
          }
        ),
      },
      //add EID slot onto MCH dashboard
      {
        id: "eid-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(eidDashboardMeta), options),
        meta: eidDashboardMeta,
      },
      //add EID action to open a component
      {
        id: "eid-summary-ext",
        slot: "eid-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/family-health-clinic/mch/EID/eid-services.components"
            ),
          {
            featureName: "eid-extension",
            moduleName,
          }
        ),
      },
      //add maternity slot onto MCH dashboard
      {
        id: "maternity-dashboard",
        slot: "mch-dashboard-slot",
        load: getSyncLifecycle(createDashboardLink(maternityMetaData), options),
        meta: maternityMetaData,
      },
      //add maternity action to open a component
      {
        id: "maternity-register-extension",
        slot: "maternity-dashboard-slot",
        load: getAsyncLifecycle(
          () =>
            import(
              "./pages/family-health-clinic/mch/maternity-register.component"
            ),
          {
            featureName: "maternity-extension",
            moduleName,
          }
        ),
      },
    ],
  };
}

export { backendDependencies, importTranslation, setupOpenMRS };
