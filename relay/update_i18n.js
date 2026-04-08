const fs = require('fs');
let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const replacements = [
    {
        target: `            noAccount: "¿No tienes una cuenta?",
            register: "Regístrate",
            terms: "Términos del Protocolo"
        },`,
        replace: `            noAccount: "¿No tienes una cuenta?",
            register: "Regístrate",
            terms: "Términos del Protocolo",
            loginTitle: "Iniciar Sesión",
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
            registerSuccess: "¡Cuenta creada! Ya puedes iniciar sesión."
        },`
    },
    {
        target: `            noAccount: "Não tem uma conta?",
            register: "Registre-se",
            terms: "Termos do Protocolo"
        },`,
        replace: `            noAccount: "Não tem uma conta?",
            register: "Registre-se",
            terms: "Termos do Protocolo",
            loginTitle: "Entrar",
            registerTitle: "Criar Conta",
            email: "E-mail",
            password: "Senha Segura",
            name: "Nome Completo",
            company: "Empresa / Projeto",
            signIn: "Entrar",
            signUp: "Criar Conta",
            forgotPassword: "Esqueceu a senha?",
            alreadyHaveAccount: "Já tem conta?",
            backToLogin: "Voltar",
            registerSuccess: "Conta criada! Agora você pode entrar."
        },`
    },
    {
        target: `            noAccount: "Нет аккаунта?",
            register: "Регистрация",
            terms: "Условия протокола"
        },`,
        replace: `            noAccount: "Нет аккаунта?",
            register: "Регистрация",
            terms: "Условия протокола",
            loginTitle: "Вход",
            registerTitle: "Регистрация",
            email: "Email",
            password: "Пароль",
            name: "Полное Имя",
            company: "Компания / Проект",
            signIn: "Войти",
            signUp: "Создать Аккаунт",
            forgotPassword: "Забыли пароль?",
            alreadyHaveAccount: "Уже есть аккаунт?",
            backToLogin: "Назад",
            registerSuccess: "Аккаунт создан! Можете войти."
        },`
    },
    {
        target: `            noAccount: "Pas de compte ?",
            register: "S'inscrire",
            terms: "Conditions d'utilisation"
        },`,
        replace: `            noAccount: "Pas de compte ?",
            register: "S'inscrire",
            terms: "Conditions d'utilisation",
            loginTitle: "Connexion",
            registerTitle: "Créer un Compte",
            email: "E-mail",
            password: "Mot de passe",
            name: "Nom Complet",
            company: "Entreprise / Projet",
            signIn: "Se Connecter",
            signUp: "S'inscrire",
            forgotPassword: "Mot de passe oublié?",
            alreadyHaveAccount: "Déjà un compte?",
            backToLogin: "Retour",
            registerSuccess: "Compte créé! Vous pouvez vous connecter."
        },`
    },
    {
        target: `            noAccount: "Kein Konto?",
            register: "Registrieren",
            terms: "Protokollbedingungen"
        },`,
        replace: `            noAccount: "Kein Konto?",
            register: "Registrieren",
            terms: "Protokollbedingungen",
            loginTitle: "Anmelden",
            registerTitle: "Konto Erstellen",
            email: "E-Mail",
            password: "Passwort",
            name: "Vollständiger Name",
            company: "Firma / Projekt",
            signIn: "Anmelden",
            signUp: "Registrieren",
            forgotPassword: "Passwort vergessen?",
            alreadyHaveAccount: "Bereits ein Konto?",
            backToLogin: "Zurück",
            registerSuccess: "Konto erstellt! Sie können sich jetzt anmelden."
        },`
    },
    {
        target: `            noAccount: "没有帐号？",
            register: "注册",
            terms: "协议条款"
        },`,
        replace: `            noAccount: "没有帐号？",
            register: "注册",
            terms: "协议条款",
            loginTitle: "登录",
            registerTitle: "创建账户",
            email: "电子邮件",
            password: "安全密码",
            name: "全名",
            company: "公司 / 项目",
            signIn: "登录",
            signUp: "注册",
            forgotPassword: "忘记密码？",
            alreadyHaveAccount: "已有账户？",
            backToLogin: "返回",
            registerSuccess: "账户已创建！现在可以登录了。"
        },`
    },
    {
        target: `            noAccount: "アカウントをお持ちでない方",
            register: "登録",
            terms: "規約"
        },`,
        replace: `            noAccount: "アカウントをお持ちでない方",
            register: "登録",
            terms: "規約",
            loginTitle: "ログイン",
            registerTitle: "アカウント作成",
            email: "メールアドレス",
            password: "パスワード",
            name: "フルネーム",
            company: "会社 / プロジェクト名",
            signIn: "サインイン",
            signUp: "登録",
            forgotPassword: "パスワードを忘れましたか？",
            alreadyHaveAccount: "すでにアカウントをお持ちですか？",
            backToLogin: "戻る",
            registerSuccess: "アカウントが作成されました！ログインできます。"
        },`
    },
    {
        target: `            noAccount: "Non hai un account?",
            register: "Registrati",
            terms: "Termini d'uso"
        },`,
        replace: `            noAccount: "Non hai un account?",
            register: "Registrati",
            terms: "Termini d'uso",
            loginTitle: "Accedi",
            registerTitle: "Crea Account",
            email: "Email",
            password: "Password Sicura",
            name: "Nome Completo",
            company: "Azienda / Progetto",
            signIn: "Accedi",
            signUp: "Registrati",
            forgotPassword: "Password dimenticata?",
            alreadyHaveAccount: "Hai già un account?",
            backToLogin: "Indietro",
            registerSuccess: "Account creato! Ora puoi accedere."
        },`
    }
];

let replacedCount = 0;
for (const rep of replacements) {
    if (code.includes(rep.target)) {
        code = code.replace(rep.target, rep.replace);
        replacedCount++;
    } else {
        console.log("Could not find exact text for: ", rep.target.split('\n')[0].trim());
    }
}

console.log('Replaced count: ', replacedCount);
fs.writeFileSync('src/lib/i18n.ts', code);
