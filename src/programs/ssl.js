import tls from "node:tls";

export function daysUntil(date) {
  const milliseconds = new Date(date) - Date.now();
  return Math.floor(milliseconds / (1000 * 60 * 60 * 24));
}

export function getCertificate(host) {
  return new Promise((resolve) => {
    const socket = tls.connect({ host, port: 443, servername: host, timeout: 3000 }, () => {
      const certificate = socket.getPeerCertificate();
      socket.destroy();
      resolve({
        issuer: certificate.issuer.O,
        daysLeft: daysUntil(certificate.valid_to),
      });
    });

    socket.on("error", () => resolve(null));
    socket.on("timeout", () => {
      socket.destroy();
      resolve(null);
    });
  });
}
