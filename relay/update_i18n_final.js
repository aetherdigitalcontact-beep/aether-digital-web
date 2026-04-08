const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const replacements = {
    es: `            loginTitle: "Iniciar Sesión",
            registerTitle: "Crear Cuenta",
            email: "Correo Electrónico",
            password: "Contraseña Segura",
            name: "Nombre Completo",
            company: "Empresa / Proyecto",
            signIn: "Entrar",
            signUp: "Crear Cuenta",
            forgotPassword: "¿Olvidaste tu contraseña?",
            alreadyHaveAccount: "¿Ya tienes cuenta?",
            backToLogin: "Volver",
            registerSuccess: "¡Cuenta creada! Ya puedes iniciar sesión.",
            validation: {
                required: "Este campo es obligatorio",
                invalidEmail: "Correo electrónico inválido",
                passwordTooShort: "La contraseña es muy corta (mín. 6 caracteres)"
            }`,
    en: `            loginTitle: "Sign In",
            registerTitle: "Create Account",
            email: "Email Address",
            password: "Secure Password",
            name: "Full Name",
            company: "Company / Project Name",
            signIn: "Sign In",
            signUp: "Create Account",
            forgotPassword: "Forgot Password?",
            alreadyHaveAccount: "Already have an account?",
            backToLogin: "Back to Login",
            registerSuccess: "Account created! You can now sign in.",
            validation: {
                required: "This field is required",
                invalidEmail: "Invalid email address",
                passwordTooShort: "Password is too short (min. 6 characters)"
            }`
};

// Precisely target ES block to avoid regex issues
const esSearch = `        auth: {
            welcome: "Bienvenido a RELAY",
            desc: "Inicia sesión con tu cuenta corporativa o usa un Enlace Mágico para entrar a la terminal.",
            google: "Iniciar sesión con Google",
            github: "Iniciar sesión con GitHub",
            apple: "Iniciar sesión con Apple",
            magic: "O utiliza un enlace mágico",
            placeholder: "nombre@empresa.com",
            send: "Enviar Enlace Mágico",
            loading: "Enviando...",
            success: "¡Revisa tu correo para el enlace mágico!",
            noAccount: "¿No tienes una cuenta?",
            register: "Regístrate",
            terms: "Términos del Protocolo"
        },`;

const esReplace = `        auth: {
            welcome: "Bienvenido a RELAY",
            desc: "Inicia sesión con tu cuenta corporativa o usa un Magic Link para acceder.",
            google: "Entrar con Google",
            github: "Entrar con GitHub",
            apple: "Entrar con Apple",
            magic: "O usa un magic link",
            placeholder: "nombre@empresa.com",
            send: "Enviar Magic Link",
            loading: "Procesando...",
            success: "¡Revisa tu correo para el enlace!",
            noAccount: "¿No tienes cuenta?",
            register: "Regístrate ahora",
            terms: "Términos del Protocolo",
` + replacements.es + `
        },`;

if (code.includes(esSearch)) {
    code = code.replace(esSearch, esReplace);
    console.log('ES Replaced');
} else {
    console.log('ES Search String mismatch');
}

// Ensure EN has validation too
const enSearch = `            registerSuccess: "Account created! You can now sign in.",
        },`;

const enReplace = `            registerSuccess: "Account created! You can now sign in.",
            validation: {
                required: "This field is required",
                invalidEmail: "Invalid email address",
                passwordTooShort: "Password is too short (min. 6 characters)"
            }
        },`;

if (code.includes(enSearch)) {
    code = code.replace(enSearch, enReplace);
    console.log('EN Updated');
} else {
    console.log('EN Search String mismatch');
}

fs.writeFileSync('src/lib/i18n.ts', code);
