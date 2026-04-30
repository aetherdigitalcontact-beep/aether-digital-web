const fs = require('fs');

const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/\{onboardingStep > 1 &&/g, '{(onboardingStep !== null ? onboardingStep : 0) > 1 &&');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed ALL onboarding step nulls!');
