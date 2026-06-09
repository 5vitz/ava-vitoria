module.exports = [
"[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/login.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "button": "login-module__YJOKya__button",
  "container": "login-module__YJOKya__container",
  "error": "login-module__YJOKya__error",
  "form": "login-module__YJOKya__form",
  "header": "login-module__YJOKya__header",
  "input": "login-module__YJOKya__input",
  "inputGroup": "login-module__YJOKya__inputGroup",
  "label": "login-module__YJOKya__label",
  "loginCard": "login-module__YJOKya__loginCard",
  "subtitle": "login-module__YJOKya__subtitle",
  "title": "login-module__YJOKya__title",
});
}),
"[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/login.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
function LoginFormContent() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [username, setUsername] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Se houver erro vindo da URL (ex: erro geral do NextAuth)
    const urlError = searchParams.get("error");
    const callbackUrl = searchParams.get("callbackUrl") || "/admin/design-system";
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!username || !password) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["signIn"])("credentials", {
                username,
                password,
                redirect: false
            });
            if (result?.error) {
                setError("Credenciais inválidas. Tente novamente.");
                setLoading(false);
            } else {
                router.push(callbackUrl);
                router.refresh();
            }
        } catch (err) {
            setError("Ocorreu um erro ao fazer login. Tente novamente.");
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loginCard,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                        children: "AVA Vitória"
                    }, void 0, false, {
                        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                        lineNumber: 54,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtitle,
                        children: "Painel de Controle"
                    }, void 0, false, {
                        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                        lineNumber: 55,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                lineNumber: 53,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].form,
                children: [
                    (error || urlError) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].error,
                        children: error || "Falha na autenticação. Verifique suas credenciais."
                    }, void 0, false, {
                        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                        lineNumber: 60,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "username",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                children: "Usuário"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                                lineNumber: 66,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "username",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                                value: username,
                                onChange: (e)=>setUsername(e.target.value),
                                placeholder: "Digite o usuário",
                                disabled: loading,
                                autoComplete: "username",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                        lineNumber: 65,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "password",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                children: "Senha"
                            }, void 0, false, {
                                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "password",
                                id: "password",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                placeholder: "Digite a senha",
                                disabled: loading,
                                autoComplete: "current-password",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].button,
                        disabled: loading,
                        children: loading ? "Entrando..." : "Acessar"
                    }, void 0, false, {
                        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
function LoginPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Suspense"], {
            fallback: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loginCard,
                style: {
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$src$2f$app$2f$admin$2f$login$2f$login$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtitle,
                    children: "Carregando painel..."
                }, void 0, false, {
                    fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                    lineNumber: 112,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                lineNumber: 111,
                columnNumber: 9
            }, this),
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Documentos$2f$Antigravity$2f$Ava$2d$Vitoria$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginFormContent, {}, void 0, false, {
                fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
                lineNumber: 115,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
            lineNumber: 110,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/Documentos/Antigravity/Ava-Vitoria/src/app/admin/login/page.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=Documentos_Antigravity_Ava-Vitoria_src_app_admin_login_1mtpwco._.js.map