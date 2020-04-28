export function isAutomation() {
  return process.env.REACT_APP_TEST === 'true';
}
