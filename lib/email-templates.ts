/**
 * Gera o template HTML para respostas de briefing seguindo a identidade visual da marca.
 */
export function getBriefingReplyTemplate(name: string, message: string) {
    const primaryColor = "#EA679B"; // Rosa (Rose)
    const inkColor = "#1c1c1c";    // Dark/Ink
    const lightBg = "#F9F9F9";     // Background claro

    // Converte quebras de linha em <br> para o HTML
    const formattedMessage = message.replace(/\n/g, '<br>');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resposta Lina Galdino</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${lightBg}; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${lightBg};">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(234, 103, 155, 0.08);">
                        <!-- Header -->
                        <tr>
                            <td align="center" style="background-color: #ffffff; padding: 45px 30px; border-bottom: 1px solid #f0f0f0;">
                                <h1 style="color: ${primaryColor}; margin: 0; font-family: 'Amoresa', 'Georgia', serif; font-size: 38px; font-weight: normal; font-style: italic;">Lina Galdino</h1>
                                <p style="color: #999999; margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 4px; font-family: 'Helvetica', sans-serif;">Estratégia & Criatividade</p>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 50px 40px;">
                                <p style="font-size: 18px; color: ${inkColor}; margin-bottom: 30px;">Olá, <strong>${name}</strong>,</p>
                                
                                <div style="font-size: 16px; line-height: 1.8; color: #444444;">
                                    ${formattedMessage}
                                </div>
                                
                                <!-- Divisor -->
                                <div style="margin: 40px 0; border-top: 1px solid #f0f0f0;"></div>
                                
                                <!-- Signature -->
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td>
                                            <p style="font-size: 14px; color: #999999; margin-bottom: 8px;">Com carinho,</p>
                                            <p style="font-size: 20px; font-weight: bold; color: ${primaryColor}; margin: 0; font-family: 'Georgia', serif;">Lina Galdino</p>
                                            <p style="font-size: 13px; color: #777777; margin: 4px 0 0 0;">Social Media & Estrategista Digital</p>
                                        </td>
                                        <td align="right">
                                            <!-- Logo ou Elemento Decorativo Opcional -->
                                            <div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${primaryColor}; opacity: 0.1;"></div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td align="center" style="background-color: #fafafa; padding: 25px 40px; border-top: 1px solid #f0f0f0;">
                                <p style="margin: 0; font-size: 13px; color: #888888;">
                                    Acompanhe meu trabalho no 
                                    <a href="https://instagram.com/linagaldin" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">Instagram</a>
                                </p>
                            </td>
                        </tr>
                    </table>
                    
                    <!-- Bottom Info -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" style="padding: 25px 0; font-size: 11px; color: #bbbbbb; text-transform: uppercase; letter-spacing: 1px;">
                                © 2026 Lina Galdino • Consultoria Digital
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}
