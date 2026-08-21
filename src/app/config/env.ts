export const APP_CONFIG = {
  appName: 'CodeTutor Africa',
  tagline: 'Offline-First AI Programming Tutor for African Universities',
  version: '0.1.0-alpha',
  author: 'CodeTutor Africa Team',
  targetSpecs: {
    minimumRamGb: 8,
    targetArch: 'Local On-Device Inference',
  },
  supportedLanguages: ['python', 'javascript', 'java', 'typescript', 'c', 'cpp'] as const,
  defaultLanguage: 'python',
}
