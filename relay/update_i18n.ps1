$path = "C:\Users\Exequiel\OneDrive\Desktop\Datos para el trabajo\AetherDigital\relay\src\lib\i18n.ts"
$content = [System.IO.File]::ReadAllText($path)

# Dictionary of replacements
$replacements = @{
    'contact: "Contact Us"' = 'contact: "Get Started"`r`n        },`r`n        legal: {`r`n            terms: "Terms of Service",`r`n            privacy: "Privacy Policy",`r`n            refund: "Refund Policy",`r`n            support: "Support"`r`n        }'
    'contact: "Contáctanos"' = 'contact: "Comenzar"`r`n        },`r`n        legal: {`r`n            terms: "Términos de Servicio",`r`n            privacy: "Política de Privacidad",`r`n            refund: "Política de Reembolso",`r`n            support: "Soporte"`r`n        }'
    'contact: "Fale Conosco"' = 'contact: "Começar"`r`n        },`r`n        legal: {`r`n            terms: "Termos de Serviço",`r`n            privacy: "Política de Privacidade",`r`n            refund: "Política de Reembolso",`r`n            support: "Suporte"`r`n        }'
    'contact: "Связаться"' = 'contact: "Начать"`r`n        },`r`n        legal: {`r`n            terms: "Условия использования",`r`n            privacy: "Поitика конфиденциальности",`r`n            refund: "Правила возврата",`r`n            support: "Поддержка"`r`n        }'
    'contact: "Contactez-nous"' = 'contact: "Commencer"`r`n        },`r`n        legal: {`r`n            terms: "Conditions d''Utilisation",`r`n            privacy: "Politique de Confidentialité",`r`n            refund: "Politique de Remboursement",`r`n            support: "Support"`r`n        }'
    'contact: "Kontaktieren Sie uns"' = 'contact: "Starten"`r`n        },`r`n        legal: {`r`n            terms: "Nutzungsbedingungen",`r`n            privacy: "Datenschutzerklärung",`r`n            refund: "Rückerstattungsrichtlinie",`r`n            support: "Support"`r`n        }'
    'contact: "联系我们"' = 'contact: "立即开始"`r`n        },`r`n        legal: {`r`n            terms: "服务条款",`r`n            privacy: "隐私政策",`r`n            refund: "退款政策",`r`n            support: "支持"`r`n        }'
    'contact: "お問い合わせ"' = 'contact: "今すぐ開始"`r`n        },`r`n        legal: {`r`n            terms: "利用規約",`r`n            privacy: "プライバシーポリシー",`r`n            refund: "返金ポリシー",`r`n            support: "サポート"`r`n        }'
    'contact: "Contattaci"' = 'contact: "Inizia"`r`n        },`r`n        legal: {`r`n            terms: "Termini di Servizio",`r`n            privacy: "Privacy Policy",`r`n            refund: "Politica di Rimborso",`r`n            support: "Supporto"`r`n        }'
}

foreach ($old in $replacements.Keys) {
    if ($content.Contains($old)) {
        $content = $content.Replace($old, $replacements[$old])
        Write-Host "Updated: $old"
    } else {
        Write-Warning "Not found: $old"
    }
}

[System.IO.File]::WriteAllText($path, $content)
Write-Host "Sync Completed."
