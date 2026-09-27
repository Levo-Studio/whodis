export const certificateErrors = [
  { code: "CERT_HAS_EXPIRED", message: "certificate expired" },
  { code: "CERT_NOT_YET_VALID", message: "certificate not valid yet" },
  { code: "ERR_TLS_CERT_ALTNAME_INVALID", message: "certificate is for a different domain" },
  { code: "DEPTH_ZERO_SELF_SIGNED_CERT", message: "self-signed certificate" },
  { code: "SELF_SIGNED_CERT_IN_CHAIN", message: "untrusted root certificate" },
  { code: "UNABLE_TO_VERIFY_LEAF_SIGNATURE", message: "incomplete certificate chain" },
  { code: "UNABLE_TO_GET_ISSUER_CERT_LOCALLY", message: "incomplete certificate chain" },
];
