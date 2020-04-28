export function isAutomation() {
  return process.env.TEST === 'true';
}
