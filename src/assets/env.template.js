(function(window) {
  window["env"] = window["env"] || {};
  window["env"]["keycloak"] = window["env"]["keycloak"] || {};

  // Environment variables
  window["env"]["keycloak"]["hostname"] = "${KEYCLOAK_HOSTNAME}";
  window["env"]["keycloak"]["realm"] = "${KEYCLOAK_REALM}";
  window["env"]["keycloak"]["clientId"] = "${KEYCLOAK_CLIENT_ID}";
  window["env"]["customStyleEnabled"] = "${CUSTOM_STYLE_ENABLED}";
  window["env"]["loggingEnabled"] = "${LOGGING_ENABLED}";
})(this);
