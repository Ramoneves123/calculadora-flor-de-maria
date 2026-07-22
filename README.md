# Calculadora Flor de Maria

Calculadora de custos e preços de sacolas de papel e plástico.

## Modo Administrador

Para acessar a aba **Configurações** e editar preços, adicione `?admin=florzinha` no final da URL.

Exemplo:
- Modo vendedor: `https://calculadora-flor-de-maria.vercel.app`
- Modo administrador: `https://calculadora-flor-de-maria.vercel.app?admin=florzinha`

Para trocar a senha, edite a linha `const ADMIN_KEY = "florzinha";` no arquivo `src/App.jsx`.
