const fs = require('fs');

const path = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// The line is: ${onboardingStep === s.id ? 'bg-accent text-white' : onboardingStep > s.id ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-600 border border-white/5'}
content = content.replace(/onboardingStep === s\.id/g, '(onboardingStep !== null ? onboardingStep : 0) === s.id');
content = content.replace(/onboardingStep > s\.id/g, '(onboardingStep !== null ? onboardingStep : 0) > s.id');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed onboarding step!');
